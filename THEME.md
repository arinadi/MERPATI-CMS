# MERPATI CMS — Theme Development Guide

Panduan ini menjelaskan arsitektur tema MERPATI CMS dan aturan yang **WAJIB** dipatuhi agar tema berfungsi dengan benar, termasuk sistem caching.

---

## Arsitektur Tema

```
themes/
└── your-theme/
    ├── index.tsx          ← Entry point: ekspor semua komponen
    └── components/
        ├── layout.tsx     ← ThemeLayout (shell: header, nav, footer)
        ├── home.tsx       ← Homepage (opsional, fallback ke Archive)
        ├── archive.tsx    ← Daftar artikel + pagination
        ├── single-post.tsx← Halaman artikel tunggal
        ├── single-page.tsx← Halaman statis tunggal
        ├── not-found.tsx  ← Halaman 404
        └── ...            ← Komponen pendukung (post-card, dll)
```

## Komponen yang Wajib Diekspor

File `themes/your-theme/index.tsx` HARUS mengekspor komponen berikut:

```tsx
import ThemeLayout from "./components/layout";
import Archive from "./components/archive";
import Home from "./components/home";          // Opsional
import SinglePost from "./components/single-post";
import SinglePage from "./components/single-page";
import NotFound from "./components/not-found";

export { ThemeLayout, Home, Archive, SinglePost, SinglePage, NotFound };
```

Setelah membuat tema, daftarkan di `lib/themes.ts`:

```tsx
import * as yourTheme from "@/themes/your-theme";

const THEME_MAP: Record<string, ThemeExports> = {
    default: defaultTheme as ThemeExports,
    "your-theme": yourTheme as ThemeExports,
};
```

Aktifkan via `.env.local`:
```
ACTIVE_THEME=your-theme
```

---

## Interface Props (dari `lib/themes.ts`)

Setiap komponen menerima props yang HARUS sesuai interface berikut:

### `ThemeLayout`
```tsx
interface ThemeLayoutProps {
    children: ReactNode;
    siteTitle: string;
    siteTagline: string;
    contacts: ContactItem[];
    primaryMenu: MenuItem[];
    footerMenu: MenuItem[];
    cacheId?: string;       // Frozen timestamp dari data cache
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
Tanpa props (kosong).

---

## Aturan Caching — SANGAT PENTING

MERPATI CMS menggunakan `unstable_cache` dari Next.js untuk meng-cache semua query database. Tema WAJIB mendukung sistem ini.

### 1. `cacheId` Prop

Prop `cacheId` pada `ThemeLayout` adalah timestamp yang **membeku saat data cache aktif**. Gunakan ini sebagai indikator visual di footer:

```tsx
// Di ThemeLayout footer:
{cacheId && (
    <span className="text-xs opacity-50">
        CACHE ID: {cacheId}
    </span>
)}
```

> [!CAUTION]
> **JANGAN** generate timestamp sendiri di komponen tema seperti `new Date().toISOString()`.
> Ini akan menyebabkan **hydration mismatch** antara server dan client,
> karena waktu server dan browser berbeda.

### 2. Jangan Gunakan `next/image`

Gunakan tag `<img>` biasa. Alasan:
- Sumber gambar bisa dari URL eksternal manapun (Unsplash, dll)
- `next/image` memerlukan konfigurasi domain di `next.config.ts`
- Tag `<img>` lebih fleksibel untuk CMS

```tsx
// ❌ JANGAN
import Image from "next/image";
<Image src={post.featuredImage} ... />

// ✅ BENAR
<img src={post.featuredImage} alt={post.title} className="..." />
```

### 3. Pagination Harus Path-Based

Pagination **WAJIB** menggunakan format URL `/page/X`, BUKAN query param `?page=X`:

```tsx
// ❌ JANGAN — query params mematikan cache Next.js
<Link href={`${basePath}?page=${page + 1}`}>

// ✅ BENAR — path-based tetap kompatibel dengan ISR cache
<Link href={`${basePath}/page/${page + 1}`}>
```

Untuk halaman pertama, link langsung ke `basePath` tanpa `/page/1`:
```tsx
href={page - 1 === 1 ? basePath : `${basePath}/page/${page - 1}`}
```

### 4. ThemeLayout Harus `"use client"`

Karena layout biasanya mengandung state (mobile menu toggle, scroll effects, dll), tandai dengan `"use client"`:

```tsx
"use client";
// ...komponen layout
```

### 5. Komponen Lain = Server Components

Kecuali ada alasan khusus (interaktivitas), biarkan komponen lain sebagai Server Components (tanpa `"use client"`).

---

## Arsitektur Data & Cache Flow

```
User Request
    ↓
middleware.ts (skip auth untuk public routes)
    ↓
app/(public)/layout.tsx
    ├── getCachedOption()        ← unstable_cache, tag: site-options
    ├── getCachedOptions()       ← unstable_cache, tag: site-options
    ├── getCachedMenuWithItems() ← unstable_cache, tag: site-menus
    ├── getCacheTimestamp()      ← unstable_cache, tag: semua
    └── render ThemeLayout
         ↓
app/(public)/[...slug]/page.tsx
    ├── getCachedPost()          ← unstable_cache, tag: posts
    ├── getCachedPage()          ← unstable_cache, tag: posts
    ├── getCachedArchivePosts()  ← unstable_cache, tag: posts
    ├── getCachedTaxonomyPosts() ← unstable_cache, tag: posts
    └── render SinglePost / SinglePage / Archive / NotFound
```

### Cache Invalidation

Saat admin menekan **"Clear All Cache"** di `/admin/cache`:
```
revalidateTag("site-options")  → Opsi & timestamp di-refresh
revalidateTag("site-menus")    → Menu di-refresh
revalidateTag("posts")         → Semua post/page/archive di-refresh
revalidatePath("/", "layout")  → Full Route Cache di-invalidate
```

---

## Middleware — Jangan Sentuh Public Routes

File `middleware.ts` dikonfigurasi agar **TIDAK** memanggil `auth()` untuk halaman publik. Ini krusial karena `auth()` membaca cookies yang akan mematikan Full Route Cache.

```typescript
// Public routes: langsung pass tanpa auth
if (!pathname.startsWith("/admin") && pathname !== "/login" && pathname !== "/setup") {
    return NextResponse.next();
}
```

> [!WARNING]
> Jika Anda memodifikasi middleware, JANGAN pernah memanggil `auth()`, `cookies()`,
> atau `headers()` untuk path publik. Ini akan mematikan semua caching.

---

## Cara Verifikasi Cache

### Benchmark Script
```bash
bash /tmp/cache_benchmark.sh
```

### Manual Check
1. `npm run build && npm start`
2. Buka halaman, lihat CACHE ID di footer
3. Refresh berkali-kali — CACHE ID harus tetap sama
4. Buka `/admin/cache` → **Clear All Cache**
5. Refresh halaman — CACHE ID harus berubah ke waktu baru, lalu kembali frozen

---

## Checklist Tema Baru

- [ ] Semua 6 komponen diekspor dari `index.tsx`
- [ ] Props sesuai interface di `lib/themes.ts`
- [ ] `cacheId` ditampilkan di footer layout
- [ ] Tidak menggunakan `next/image`
- [ ] Tidak menggunakan `new Date()` di komponen
- [ ] Pagination path-based (`/page/X`), bukan query param
- [ ] Layout ditandai `"use client"`
- [ ] Tidak ada hydration mismatch (test di production build)
- [ ] Build berjalan tanpa error (`npm run build`)
- [ ] Lint bersih (`npm run lint`)
