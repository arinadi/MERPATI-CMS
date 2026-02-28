# MERPATI-CMS — Product Requirements Document

**MERPATI** — *Media Editorial Ringkas, Praktis, Aman, Tetap Independen*

> *"Kebebasan pers dimulai dari kemandirian infrastrukturnya."*
> *"Press freedom begins with infrastructure independence."*

---

## Phase 0: Project Context

| Field | Value |
|---|---|
| **Project Type** | Greenfield |
| **Existing Assets** | None — blank canvas |
| **Constraints** | Vercel Free Tier (limited serverless functions), Neon DB free tier, Vercel Blob free tier |
| **Target Users** | Indonesian journalists familiar with WordPress |
| **Business Goal** | Free CMS for journalists → if it grows, journalists become media partners or introduce paying clients |

---

## The Story (The Pain)

Indonesian journalists need a familiar writing platform — like WordPress. But WordPress hosting is expensive: VPS, MySQL, PHP, maintenance. For beginner or freelance journalists, this cost is a barrier.

**MERPATI-CMS** solves this with a serverless architecture that runs for free on Vercel Free Tier. Look & feel like WordPress Admin, but under the hood everything is serverless — no server to maintain, no monthly VPS bill.

---

## Core Features (NO CAPES!)

### 1. 📝 Classic Editor (WordPress-style)
- Toolbar formatting: **Bold**, *Italic*, Heading (H2–H4), Link, Quote, List (OL/UL), Align
- Media insert button → upload to Vercel Blob
- Inline image preview after upload
- HTML mode toggle (visual ↔ code)
- Autosave draft every 30 seconds
- Excerpt / summary
- Featured image
- Permalink editor (auto-generated from title)

### 2. 📋 Post Management
- List all posts with status: Draft, Published, Trash
- Quick actions: Edit, Delete, Publish/Unpublish
- Bulk actions (select multiple → delete/publish)
- Search & filter by status, category, date
- Pagination
- **Published by** tracking — records the user who pressed the Publish button (typically the editor)

### 3. 🏷️ Categories & Tags
- CRUD categories (hierarchical — parent/child)
- CRUD tags (flat taxonomy)
- Assign multiple categories & tags to a post

### 4. 📄 Pages (Static Content)
- CRUD static pages (About, Contact, etc.)
- Same editor as Posts
- Parent/child hierarchy for nested pages

### 5. 📷 Media Library
- Upload images to Vercel Blob
- Gallery view of all media
- Delete media
- Copy URL for reuse
- Image metadata (filename, size, upload date)

### 6. 🎨 Theme System
- **File-based themes** with inheritance (child theme extends parent)
- Template resolution: child theme → parent theme fallback
- Each theme = folder containing `theme.json` (config) + `templates/` + `assets/`
- **Child theme** only overrides files that need changing
- Hot-reload during development
- Architecture details in [Theme System Architecture](#theme-system-architecture)

### 7. 👤 User Management (Simplified, Invite-Only)
- **No sign-up form** — Google OAuth login only
- **No passwords** — all auth via Google
- First user to log in = **Super User** (auto-assigned)
- Super User can **invite users** via email (whitelist)
- Invited users log in with Google → automatically registered
- **Only Super User** can:
  - Manage all users (edit roles, deactivate)
  - Promote other users to Super User
  - Invite new users
  - Manage themes, settings, categories, tags, pages
- Roles: `super_user`, `user` (kept simple for beginners; can evolve to editor/author/contributor when team exceeds 3)
- **All users can publish** — no draft-only restrictions
- Role permissions detailed in [Role Permissions](#role-permissions)

### 8. ⚙️ Settings
- Site title, tagline, description
- Logo & favicon upload
- Social media links
- SEO defaults (meta description template)
- Posts per page
- Active theme selection

### 9. 🔧 Dashboard
- Overview: total posts, pages, drafts, published
- Recent posts list
- Quick Draft widget (write directly from dashboard)

### 11. 🔔 Telegram Notifications
One-way notifications via Telegram Bot API — no polling, send-only.

- **Setup**: Super User configures Bot Token + Chat ID in Settings
- **Notification triggers**:
  - Post published (title, author, link)
  - New user joined (name, email)
  - Post submitted for review (if future workflow added)
- **Format**: Formatted Telegram message with MarkdownV2
- **Implementation**: Simple `fetch()` to `https://api.telegram.org/bot<token>/sendMessage` — no library needed
- **No polling / webhook** — purely outbound push from server to Telegram
- **Failure handling**: Silent fail with error logging (non-blocking, notifications are best-effort)

### 10. 🔗 Share & SEO Metadata Engine
The most critical feature for content distribution — without optimized sharing, content is dead.

#### Meta Tags (Auto-generated per post/page)
- **Open Graph** (Facebook, WhatsApp, Telegram, LINE, Discord)
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (article)
  - `og:site_name`, `og:locale` (id_ID)
  - `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag`
- **Twitter Card**
  - `twitter:card` = `summary_large_image`
  - `twitter:title`, `twitter:description`, `twitter:image`
  - `twitter:site`, `twitter:creator`
- **Standard SEO**
  - `<title>`, `meta description`, `canonical URL`
  - `robots` (index/noindex)
  - Hreflang for future multi-language support

#### Structured Data (JSON-LD)
- **`NewsArticle`** schema per post — required for Google News
  - `headline`, `image`, `datePublished`, `dateModified`
  - `author` (Person), `publisher` (Organization + logo)
  - `description`, `mainEntityOfPage`
- **`WebSite`** schema on homepage — enables Google Sitelinks
- **`BreadcrumbList`** schema — SERP navigation
- **`Organization`** schema — site identity

#### News Portal Optimization
- **Google News**:
  - `NewsArticle` JSON-LD (required)
  - News Sitemap XML (`/news-sitemap.xml`) — max 1000 articles from the last 48 hours
  - Proper `<article>` semantic HTML
  - `article:section` mapped to Google News categories
- **Microsoft Start / MSN**:
  - Valid RSS/Atom feed (`/feed.xml`)
  - Complete Open Graph tags (MSN crawler relies on OG)
  - Featured image minimum 1200×630px (recommended)
- **Apple News**: Open Graph + structured data is sufficient
- **LINE / Telegram / Discord**: Open Graph meta tags

#### RSS & Sitemap
- `/feed.xml` — RSS 2.0 feed (all published posts)
- `/feed/category/[slug].xml` — RSS per category
- `/sitemap.xml` — Standard sitemap for SEO
- `/sitemap-posts.xml` — Posts-specific sitemap
- `/sitemap-pages.xml` — Pages-specific sitemap
- `/news-sitemap.xml` — Google News sitemap (last 48 hours)
- `/robots.txt` — auto-generated, links to sitemap

#### Share UI (Public Post)
- Share buttons: WhatsApp, X/Twitter, Facebook, Telegram, Copy Link
- Sticky share buttons on mobile (bottom bar)
- "Copy Link" with visual feedback (copied!)
- No share counts (cape & privacy concerns)

#### SEO Fields in Editor (Admin)
- "SEO" tab/section in editor sidebar:
  - **SEO Title** — overrides `og:title` & `<title>` (default = post title)
  - **Meta Description** — overrides `og:description` (default = excerpt, fallback auto-truncate content to 160 chars)
  - **Featured Image** also becomes `og:image` automatically
  - **Canonical URL** — optional override
  - **Robots** — `index`/`noindex` toggle
- Live preview: "This is how it looks on Google / WhatsApp"

---

## Theme System Architecture

### Concept: Composition + File-Based Override + Class Engine

The best combination of OOP and pragmatic file-based approach (like WordPress but modern):

```
themes/
  default/                    # Parent theme (built-in)
    theme.json                # Config: colors, fonts, layout, metadata
    templates/
      layout.hbs              # Base layout (Handlebars)
      index.hbs               # Homepage / post list
      single.hbs              # Single post
      page.hbs                # Static page
      archive.hbs             # Category/tag archive
      partials/
        header.hbs
        footer.hbs
        post-card.hbs
        pagination.hbs
        sidebar.hbs
    assets/
      style.css               # Theme CSS
      script.js               # Theme JS (optional)

  developer-dark/             # Child theme
    theme.json                # { "extends": "default", "name": "Developer Dark", ... }
    templates/
      partials/
        header.hbs            # Override header only
    assets/
      style.css               # Additional/override CSS
```

### Engine Class (TypeScript)

```typescript
class ThemeEngine {
  private activeTheme: ThemeConfig;
  private parentTheme: ThemeConfig | null;

  // Resolve template: check child → fallback parent
  resolveTemplate(name: string): string { ... }

  // Merge config: parent defaults + child overrides
  resolveConfig(): ThemeConfig { ... }

  // Render page with data context
  render(template: string, data: object): string { ... }
}
```

### theme.json Schema

```json
{
  "name": "Developer Dark",
  "version": "1.0.0",
  "extends": "default",
  "author": "Your Name",
  "description": "A dark theme for developer blogs",
  "config": {
    "colors": {
      "primary": "#0F172A",
      "accent": "#38BDF8",
      "background": "#020617",
      "text": "#E2E8F0",
      "surface": "#1E293B"
    },
    "typography": {
      "heading": "JetBrains Mono",
      "body": "Inter",
      "code": "Fira Code"
    },
    "layout": {
      "maxWidth": "768px",
      "sidebar": false,
      "postsPerPage": 10
    }
  }
}
```

### Why Not Pure OOP Class Inheritance?

| Approach | Pro | Con |
|---|---|---|
| **Pure OOP (class extends)** | Familiar for developers | Must compile, not vibes coding |
| **Pure File Override** | Vibes coding, edit files directly | Less type-safe |
| **Hybrid (our choice)** ✅ | OOP type-safe engine + edit theme files directly | Slightly more complex setup |

**Hybrid approach** = ThemeEngine class as the resolution engine (OOP, type-safe), but themes themselves are file folders you edit directly. Developers just copy the parent theme folder, rename it, and override the files they want to change. **Vibes coding!**

---

## Role Permissions

> [!NOTE]
> Kept intentionally simple for small teams (≤3). When teams grow, roles can be extended to `editor`, `author`, `contributor` with granular permissions.

| Permission | Super User | User |
|---|---|---|
| Write/edit own posts | ✅ | ✅ |
| Publish own posts | ✅ | ✅ |
| Edit all posts | ✅ | ❌ |
| Delete any post | ✅ | ❌ |
| Manage categories/tags | ✅ | ❌ |
| Manage pages | ✅ | ❌ |
| Manage media | ✅ | ✅ (own) |
| Manage themes | ✅ | ❌ |
| Manage settings | ✅ | ❌ |
| Configure Telegram notifications | ✅ | ❌ |
| Invite users | ✅ | ❌ |
| Manage users (edit/deactivate) | ✅ | ❌ |
| Promote to Super User | ✅ | ❌ |
| View dashboard | ✅ | ✅ |

---

## Base Features (CRUD Details)

### Posts
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | VARCHAR(255) | Required |
| `slug` | VARCHAR(255) | Unique, auto-generated |
| `content` | TEXT | HTML content from editor |
| `excerpt` | TEXT | Optional summary / meta description fallback |
| `featured_image` | VARCHAR(500) | Vercel Blob URL, also used as og:image |
| `status` | ENUM | `draft`, `published`, `trash` |
| `author_id` | UUID | FK to users — the writer |
| `published_by` | UUID | FK to users — who pressed Publish (typically the editor) |
| `published_at` | TIMESTAMP | Nullable, set on publish |
| `seo_title` | VARCHAR(255) | Nullable, override for `<title>` & `og:title` |
| `seo_description` | VARCHAR(500) | Nullable, override for meta description |
| `canonical_url` | VARCHAR(500) | Nullable, custom canonical |
| `is_indexable` | BOOLEAN | Default true, set false for noindex |
| `created_at` | TIMESTAMP | Auto |
| `updated_at` | TIMESTAMP | Auto |

### Categories
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Required |
| `slug` | VARCHAR(100) | Unique |
| `description` | TEXT | Optional |
| `parent_id` | UUID | Nullable, FK to self |

### Tags
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Required |
| `slug` | VARCHAR(100) | Unique |

### Post ↔ Category (Many-to-Many)
| Field | Type |
|---|---|
| `post_id` | UUID FK |
| `category_id` | UUID FK |

### Post ↔ Tag (Many-to-Many)
| Field | Type |
|---|---|
| `post_id` | UUID FK |
| `tag_id` | UUID FK |

### Pages
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | VARCHAR(255) | Required |
| `slug` | VARCHAR(255) | Unique |
| `content` | TEXT | HTML |
| `status` | ENUM | `draft`, `published` |
| `author_id` | UUID | FK to users |
| `published_by` | UUID | FK to users — who published |
| `parent_id` | UUID | Nullable FK to self |
| `sort_order` | INT | Menu ordering |
| `seo_title` | VARCHAR(255) | Nullable, SEO title override |
| `seo_description` | VARCHAR(500) | Nullable, meta description override |
| `canonical_url` | VARCHAR(500) | Nullable |
| `is_indexable` | BOOLEAN | Default true |
| `created_at` | TIMESTAMP | Auto |
| `updated_at` | TIMESTAMP | Auto |

### Media
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `filename` | VARCHAR(255) | Original filename |
| `blob_url` | VARCHAR(500) | Vercel Blob URL |
| `mime_type` | VARCHAR(50) | e.g. `image/jpeg` |
| `size_bytes` | BIGINT | File size |
| `alt_text` | VARCHAR(255) | Accessibility |
| `uploaded_by` | UUID | FK to users |
| `uploaded_at` | TIMESTAMP | Auto |

### Users
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | From Google profile |
| `email` | VARCHAR(255) | Unique, from Google |
| `google_id` | VARCHAR(255) | Unique, Google sub claim |
| `avatar_url` | VARCHAR(500) | From Google profile |
| `bio` | TEXT | Optional, editable |
| `role` | VARCHAR(20) | `super_user` or `user` |
| `is_active` | BOOLEAN | Default true, can be deactivated |
| `invited_by` | UUID | Nullable FK to users |
| `created_at` | TIMESTAMP | Auto |

### Invitations
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | VARCHAR(255) | Invited email address |
| `role` | VARCHAR(20) | `super_user` or `user` (default: `user`) |
| `invited_by` | UUID | FK to users (Super User) |
| `accepted_at` | TIMESTAMP | Nullable, set on first login |
| `created_at` | TIMESTAMP | Auto |

### Settings
| Field | Type | Notes |
|---|---|---|
| `key` | VARCHAR(100) | Primary key |
| `value` | TEXT | JSON or string |

---

## Authentication Flow

```
1. User clicks "Login with Google"
2. Redirect to Google OAuth consent screen
3. Google callback → server verifies token
4. Check: does google_id exist in users table?
   ├── Yes → Login success, generate JWT cookie
   └── No → Check: does email exist in invitations table (not yet accepted)?
       ├── Yes → Create user, assign role from invitation, mark accepted, JWT cookie
       │         → Send Telegram notification: "New user joined"
       └── No → Check: are there zero users in the DB?
           ├── Yes → Create as super_user (first user), JWT cookie
           └── No → Reject: "You have not been invited." Show denied page.
```

---

## User Flow

### Admin Flow
```
Google Login → Dashboard
  ├── Posts → All Posts / Add New → Classic Editor → Save Draft / Publish
  │           → On Publish → Telegram notification sent
  ├── Pages → All Pages / Add New → Editor → Save Draft / Publish
  ├── Media → Library → Upload / Delete
  ├── Categories → CRUD (super_user only)
  ├── Tags → CRUD (super_user only)
  ├── Themes → Select active theme (super_user only)
  ├── Settings → Site config + Telegram bot setup (super_user only)
  ├── Users → Invite / Manage roles (super_user only)
  └── Profile → Edit bio, view own info
```

### Public Flow
```
Homepage (post list, cached)
  → Single Post (cached, shows author + published_by)
  → Category Archive (cached)
  → Tag Archive (cached)
  → Single Page (cached)
```

---

## Non-Functional Requirements

### Performance
- **Admin pages**: < 500ms response (dynamic, SPA-like)
- **Public pages**: < 200ms (static/cached via Vercel Edge)
- **Editor autosave**: debounced 30s, < 300ms API call

### Security
- **Auth**: Google OAuth 2.0 → JWT in httpOnly secure cookie, 7-day expiry
- **No password storage** — all via Google
- **CSRF**: Origin header validation
- **Input**: HTML sanitization (DOMPurify) on save & render
- **Rate Limiting**: API endpoints via Vercel middleware
- **Invitation-only**: Cannot log in without invitation (except first user)

### Scalability
- Serverless = horizontal auto-scaling
- Neon DB free tier: 0.5 GB storage, auto-suspend
- Vercel Blob: 500 MB free tier
- Cache-first public pages (ISR/stale-while-revalidate)

### Accessibility
- WCAG 2.1 Level AA for public pages
- Semantic HTML, proper headings, alt text
- Keyboard-navigable admin

---

## Success Criteria

| KPI | Target |
|---|---|
| Full admin CRUD operational | ✅ All features working |
| Google OAuth login working | ✅ Invite-only system |
| Simplified roles (super_user/user) | ✅ All users can publish |
| Theme system with child theme | ✅ File-based + engine |
| Share preview on WhatsApp/Telegram | ✅ Rich preview (image + title + desc) |
| Google News structured data valid | ✅ NewsArticle JSON-LD passes Rich Results Test |
| RSS feed valid | ✅ Valid RSS 2.0, parseable by aggregators |
| SEO fields in editor | ✅ Title, description, canonical, robots |
| Telegram notifications working | ✅ Post published + new user joined |
| Public page load (cached) | < 200ms |
| Vercel Free Tier compatible | $0/month baseline |
| WordPress-familiar UI | Journalists can use without training |
| Mobile responsive (public) | Lighthouse score 90+ |
| Deploy-ready | One-click deploy to Vercel |
