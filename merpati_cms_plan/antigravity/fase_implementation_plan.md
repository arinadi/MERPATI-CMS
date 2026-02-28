# MERPATI-CMS — Implementation Plan

## Fase 1: Init Starter Project ← **SEKARANG**
> Server berjalan, struktur project siap

- Init Next.js 15 (App Router, TypeScript, pnpm) 
- Install semua dependencies
- Setup `globals.css` dengan design tokens
- Setup `.env.example`
- Root layout + placeholder pages → `pnpm dev` berjalan

---

## Fase 2: Frontend (Dummy Data)
> Semua halaman bisa dinavigasi, router lengkap. Boleh dipecah sub-fase.

### 2.1 — Auth Pages + Admin Layout
- Login page, denied page
- Admin shell (sidebar, topbar, responsive)
- Toast notification system

### 2.2 — Dashboard + Post Management UI
- Dashboard (At a Glance, Quick Draft, Recent Posts)
- All Posts (table, filters, pagination)
- Classic Editor (toolbar, sidebar meta boxes, SEO panel)

### 2.3 — Pages, Media, Categories, Tags UI
- All Pages + editor
- Media Library (grid, upload dropzone, detail panel)
- Categories & Tags CRUD split-view

### 2.4 — Users, Settings, Themes, Profile UI
- Users page + invite modal
- Settings (tabbed: General, SEO, Telegram, Social)
- Themes page
- Profile page

### 2.5 — Public Pages (Theme Templates)
- Public layout (header, footer, nav)
- Homepage (post list, featured)
- Single post, single page
- Category/tag archive
- Share buttons

---

## Fase 3: Backend
> DB, lib, API routes, full integration testing

- Drizzle schema + Neon DB connection + migrations
- Auth.js v5 (Google OAuth, JWT, invitation flow)
- Middleware (route protection, role check)
- All API routes (posts, pages, media, categories, tags, users, settings, themes, dashboard)
- ThemeEngine (Handlebars resolver)
- Telegram notifications
- RSS, Sitemap, robots.txt
- SEO meta + JSON-LD
- Utility libs (sanitize, slug, seo helpers)

---

## Verification Plan

| Fase | Kriteria Sukses |
|------|----------------|
| 1 | `pnpm dev` berjalan, browser bisa akses localhost |
| 2 | Semua halaman bisa dinavigasi dengan dummy data |
| 3 | Full flow: login → dashboard → CRUD → public page |
