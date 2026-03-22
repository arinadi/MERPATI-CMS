# MERPATI CMS — Theme Development Guide

This guide explains the MERPATI CMS theme architecture and the rules that **MUST** be followed for the theme to work correctly, including the caching system.

---

## Theme Architecture

```
themes/
└── your-theme/
    ├── index.tsx          ← Entry point: export all components
    └── components/
        ├── layout.tsx     ← ThemeLayout (shell: header, nav, footer)
        ├── home.tsx       ← Homepage (optional, falls back to Archive)
        ├── archive.tsx    ← Article list + pagination
        ├── single-post.tsx← Single article page
        ├── single-page.tsx← Single static page
        ├── not-found.tsx  ← 404 page
        └── ...            ← Supporting components (post-card, etc.)
```

## Required Exported Components

The `themes/your-theme/index.tsx` file MUST export the following components:

```tsx
import ThemeLayout from "./components/layout";
import Archive from "./components/archive";
import Home from "./components/home";          // Optional
import SinglePost from "./components/single-post";
import SinglePage from "./components/single-page";
import NotFound from "./components/not-found";

export { ThemeLayout, Home, Archive, SinglePost, SinglePage, NotFound };
```

After creating the theme, register it in `lib/themes.ts`:

```tsx
import * as yourTheme from "@/themes/your-theme";

const THEME_MAP: Record<string, ThemeExports> = {
    default: defaultTheme as ThemeExports,
    "your-theme": yourTheme as ThemeExports,
};
```

Activate it via `.env.local`:
```
ACTIVE_THEME=your-theme
```

---

## Props Interfaces (from `lib/themes.ts`)

Each component receives props that MUST conform to the following interfaces:

### `ThemeLayout`
```tsx
interface ThemeLayoutProps {
    children: ReactNode;
    siteTitle: string;
    siteTagline: string;
    contacts: ContactItem[];
    primaryMenu: MenuItem[];
    footerMenu: MenuItem[];
    cacheId?: string;       // Frozen timestamp from cached data
}
```

### `SinglePost`
```tsx
interface SinglePostProps {
    post: PostData;
    relatedPosts?: PostCardData[];
}
```

### `SinglePage`
```tsx
interface SinglePageProps {
    page: PageData;
}
```

### `Archive` & `Home`
```tsx
interface ArchiveProps {
    title: string;
    description?: string;
    posts: PostCardData[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        basePath: string;
    };
}
```

### `NotFound`
No props (empty).

---

## Caching Rules — VERY IMPORTANT

MERPATI CMS uses `unstable_cache` from Next.js to cache all database queries. Themes MUST support this system.

### 1. The `cacheId` Prop

The `cacheId` prop on `ThemeLayout` is a timestamp that **freezes when the cache is active**. Use it as a visual indicator in the footer:

```tsx
// In ThemeLayout footer:
{cacheId && (
    <span className="text-xs opacity-50">
        CACHE ID: {cacheId}
    </span>
)}
```

> [!CAUTION]
> **DO NOT** generate your own timestamp inside theme components using `new Date().toISOString()`.
> This will cause a **hydration mismatch** between server and client,
> because the server and browser times will differ.

### 2. Do Not Use `next/image`

Use a plain `<img>` tag instead. Reasons:
- Image sources can come from any external URL (Unsplash, etc.)
- `next/image` requires domain configuration in `next.config.ts`
- The `<img>` tag is more flexible for a CMS

```tsx
// ❌ DON'T
import Image from "next/image";
<Image src={post.featuredImage} ... />

// ✅ CORRECT
<img src={post.featuredImage} alt={post.title} className="..." />
```

### 3. Pagination Must Be Path-Based

Pagination **MUST** use the URL format `/page/X`, NOT query params `?page=X`:

```tsx
// ❌ DON'T — query params disable Next.js cache
<Link href={`${basePath}?page=${page + 1}`}>

// ✅ CORRECT — path-based stays compatible with ISR cache
<Link href={`${basePath}/page/${page + 1}`}>
```

For the first page, link directly to `basePath` without `/page/1`:
```tsx
href={page - 1 === 1 ? basePath : `${basePath}/page/${page - 1}`}
```

### 4. ThemeLayout Must Be `"use client"`

Since layouts typically contain state (mobile menu toggle, scroll effects, etc.), mark it with `"use client"`:

```tsx
"use client";
// ...layout component
```

### 5. Other Components = Server Components

Unless there is a specific reason (interactivity), leave other components as Server Components (without `"use client"`).

### 6. Search Must Navigate to `/search/{query}`

The search input in the layout MUST be wrapped in a `<form>` with an `onSubmit` handler that uses `useRouter` to navigate:

```tsx
const [searchQuery, setSearchQuery] = useState("");
const router = useRouter();

function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
        router.push(`/search/${encodeURIComponent(q)}`);
        setSearchQuery("");
    }
}
```

The `[...slug]` catch-all route handles `/search/{query}` and renders results via the `Archive` component. Search uses `ilike` for full-text matching on title, excerpt, and content.

> [!NOTE]
> Search results are also cached via `unstable_cache` with tag `posts`.
> Clearing cache will refresh search results too.

---

## Data Architecture & Cache Flow

```
User Request
    ↓
middleware.ts (skip auth for public routes)
    ↓
app/(public)/layout.tsx
    ├── getCachedOption()        ← unstable_cache, tag: site-options
    ├── getCachedOptions()       ← unstable_cache, tag: site-options
    ├── getCachedMenuWithItems() ← unstable_cache, tag: site-menus
    ├── getCacheTimestamp()      ← unstable_cache, tag: all
    └── render ThemeLayout
         ↓
app/(public)/[...slug]/page.tsx
    ├── getCachedPost()            ← unstable_cache, tag: posts
    ├── getCachedPage()            ← unstable_cache, tag: posts
    ├── getCachedArchivePosts()    ← unstable_cache, tag: posts
    ├── getCachedTaxonomyPosts()   ← unstable_cache, tag: posts
    ├── getCachedSearchResults()   ← unstable_cache, tag: posts
    └── render SinglePost / SinglePage / Archive / NotFound
```

### Cache Invalidation

When an admin clicks **"Clear All Cache"** at `/admin/cache`:
```
revalidateTag("site-options")  → Options & timestamp are refreshed
revalidateTag("site-menus")    → Menus are refreshed
revalidateTag("posts")         → All posts/pages/archives are refreshed
revalidatePath("/", "layout")  → Full Route Cache is invalidated
```

---

## Middleware — Do Not Touch Public Routes

`middleware.ts` is configured so that it **does NOT** call `auth()` for public pages. This is crucial because `auth()` reads cookies, which disables the Full Route Cache.

```typescript
// Public routes: pass through directly without auth
if (!pathname.startsWith("/admin") && pathname !== "/login" && pathname !== "/setup") {
    return NextResponse.next();
}
```

> [!WARNING]
> If you modify the middleware, NEVER call `auth()`, `cookies()`,
> or `headers()` for public paths. This will disable all caching.

---

## How to Verify Caching

### Benchmark Script
```bash
bash /tmp/cache_benchmark.sh
```

### Manual Check
1. `npm run build && npm start`
2. Open a page and check the CACHE ID in the footer
3. Refresh multiple times — the CACHE ID must stay the same
4. Go to `/admin/cache` → **Clear All Cache**
5. Refresh the page — the CACHE ID must change to a new time, then freeze again

---

## URL Routes Handled by `[...slug]`

| URL Pattern | Handler | Component |
|---|---|---|
| `/{post-slug}` | `getCachedPost()` | `SinglePost` |
| `/{page-slug}` | `getCachedPage()` | `SinglePage` |
| `/archive` | `getCachedArchivePosts()` | `Archive` |
| `/archive/page/2` | `getCachedArchivePosts()` | `Archive` (page 2) |
| `/category/{slug}` | `getCachedTaxonomyPosts()` | `Archive` |
| `/tag/{slug}` | `getCachedTaxonomyPosts()` | `Archive` |
| `/search/{query}` | `getCachedSearchResults()` | `Archive` |

---

## New Theme Checklist

- [ ] All 6 components exported from `index.tsx`
- [ ] Props conform to the interfaces in `lib/themes.ts`
- [ ] `cacheId` is displayed in the footer layout
- [ ] `next/image` is not used
- [ ] `new Date()` is not used in any component
- [ ] Pagination is path-based (`/page/X`), not query params
- [ ] Search form navigates to `/search/{query}` on Enter
- [ ] Layout is marked `"use client"`
- [ ] No hydration mismatches (test on a production build)
- [ ] Build runs without errors (`npm run build`)
- [ ] Lint is clean (`npm run lint`)