# MERPATI-CMS — Fase 1 Walkthrough

## What Was Done

Initialized MERPATI-CMS starter project from scratch. Server running at `http://localhost:3000`.

## Files Created

| File | Purpose |
|------|---------|
| `.env.example` | Environment variable template |
| `app/globals.css` | Design tokens + component styles (buttons, cards, forms, tables, toast) |
| `app/layout.tsx` | Root layout (`lang="id"`, MERPATI metadata) |
| `app/page.tsx` | Landing page with branding |
| `app/(auth)/login/page.tsx` | Google OAuth login page |
| `app/(auth)/denied/page.tsx` | Access denied page |
| `app/(admin)/layout.tsx` | Admin shell (sidebar + topbar) |
| `app/(admin)/dashboard/page.tsx` | Dashboard placeholder |
| `lib/utils.ts` | Utilities (slug, date, truncate, reading time, etc.) |

## Dependencies Installed

**Production**: `next@16`, `react@19`, `next-auth@beta`, `drizzle-orm`, `@neondatabase/serverless`, `@vercel/blob`, `handlebars`, `isomorphic-dompurify`, `zod`

**Dev**: `drizzle-kit`, `typescript`, `eslint`, `@types/dompurify`

## Verified Pages

````carousel
![Homepage — landing page with MERPATI branding](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/home_page_1772261348038.png)
<!-- slide -->
![Login — Google OAuth button card](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/login_page_1772261357706.png)
<!-- slide -->
![Denied — access denied for non-invited users](/home/arinadi/.gemini/antigravity/brain/6516c42a-28c3-4fd3-a5b7-ff8144e5263b/denied_page_1772261370943.png)
````

## Routes Working

| Route | Status |
|-------|--------|
| `/` | ✅ Landing page |
| `/login` | ✅ Google OAuth card |
| `/denied` | ✅ Access denied |
| `/dashboard` | ✅ Admin layout + sidebar |

## Next: Fase 2

Frontend UI with dummy data — starting from sub-fase 2.1 (admin layout polish, then dashboard + post management).
