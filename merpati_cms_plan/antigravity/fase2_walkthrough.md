# MERPATI-CMS — Fase 1 & 2 Walkthrough

## What Was Done (Fase 1: Init)
Initialized MERPATI-CMS starter project from scratch. Server running at `http://localhost:3000`. Set up all global CSS design tokens, root layouts, and utility functions. Installed all core dependencies (Next.js, NextAuth, Drizzle, Vercel Blob, dll).

## What Was Done (Fase 2: Frontend Admin)
Built out the complete administrative UI (11 pages) using the established design tokens. The entire admin interface is currently powered by mock state and dummy data to validate the User Experience (UX) before connecting the backend.

### Key Components Implemented
- **Admin Layout:** Responsive sidebar, topbar, mobile hamburger menu, and active navigation state. Powered by `admin.css`.
- **Dashboard:** At-a-glance stats, Quick Draft form, and Recent Posts list.
- **Classic Editor:** A rich text editor layout featuring a custom toolbar, HTML mode toggle, and WordPress-style sidebar meta boxes (Publish settings, Categories, Tags, Featured Image, and SEO preview).
- **Data Tables:** Reusable list views for Posts, Pages, Users, Categories, and Tags, complete with hover-state row actions.
- **Media Library:** Grid view, upload dropzone, and detail inspection panel.
- **Settings:** Tabbed interface (General, SEO, Telegram bot config, Social links).

## Visual Verification (Fase 2)

````carousel
![Admin Dashboard with stats, quick draft, and recent posts](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/admin_dashboard_1772262540573.png)
<!-- slide -->
![Classic Editor showing toolbar, writing area, and meta boxes](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/admin_editor_1772262572433.png)
<!-- slide -->
![Themes page with active default theme and child theme concepts](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/admin_themes_1772262685244.png)
````

## All Routes Verified

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ | Landing page |
| `/login` | ✅ | Google OAuth card |
| `/dashboard` | ✅ | Main stats overview |
| `/posts` | ✅ | List, filters, bulk actions |
| `/posts/new` | ✅ | Classic editor |
| `/media` | ✅ | Grid & upload zone |
| `/pages-manage`| ✅ | Static pages list |
| `/categories`| ✅ | Split view form/table |
| `/tags` | ✅ | Split view form/table |
| `/users` | ✅ | List + invite system |
| `/settings` | ✅ | Multi-tab configuration |
| `/themes` | ✅ | Theme cards |
| `/profile` | ✅ | User bio |
| `/(public)` | ✅ | Public theme wrapper (`layout.tsx`) with Header & Footer |
| `/(public)/page.tsx` | ✅ | News homepage with Laporan Utama & Terbaru |
| `/(public)/[slug]` | ✅ | Single Article View |
| `/(public)/category/[slug]`| ✅ | Category Feed |

## Visual Verification (Fase 2.5 - Public Theme)

````carousel
![Public Homepage - News Portal Layout](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/homepage_top_1772264061690.png)
<!-- slide -->
![Category View Component](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/category_ekonomi_1772264152984.png)
````

## Next: Fase 3
Backend implementation! Setting up the database schema, configuring Auth.js, and building out the API routes to connect this UI to real data.
