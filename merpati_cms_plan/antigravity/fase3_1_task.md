# MERPATI-CMS — Task Checklist

## Fase 1: Init Starter Project ✅
- [x] Init Next.js 15 (App Router, TypeScript, npm)
- [x] Install dependencies (next-auth, drizzle-orm, @neondatabase/serverless, @vercel/blob, handlebars, isomorphic-dompurify, zod, drizzle-kit)
- [x] Create `.env.example`
- [x] Setup `globals.css` with design tokens
- [x] Setup root layout + landing page
- [x] Create auth pages (login, denied)
- [x] Create admin layout (sidebar + topbar)
- [x] Create `lib/utils.ts`
- [x] Verify `pnpm dev` runs successfully

## Fase 2: Frontend (Dummy Data) ✅
- [x] 2.1 — Auth Pages + Admin Layout (CSS, responsive sidebar)
- [x] 2.2 — Dashboard (stats, quick draft) + Post Management (list, classic editor)
- [x] 2.3 — Pages, Media (grid/dropzone), Categories, Tags UI
- [x] 2.4 — Users (invites), Settings (tabs), Themes, Profile UI
- [x] 2.5 — Public Pages (Default Theme) with dummy posts
- [x] 2.6 — Verify all admin & public routes running properly

## Fase 3: Backend
- [x] DB schema (Neon + Drizzle)
- [ ] DB connection + push (Requires user .env)
- [ ] Auth.js + middleware (Google OAuth)
- [ ] API routes (CRUD operations)
- [ ] Theme engine + public rendering
- [ ] Telegram, RSS, Sitemap, SEO
