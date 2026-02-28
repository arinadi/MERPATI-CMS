# MERPATI-CMS — Task Checklist

## Fase 1: Init Starter Project ✅
- [x] Init Next.js 15 (App Router, TypeScript, npm)
- [x] Install dependencies (next-auth, drizzle-orm, @neondatabase/serverless, @vercel/blob, handlebars, isomorphic-dompurify, zod, drizzle-kit)
- [x] Create `.env.example`
- [x] Setup `globals.css` with design tokens (admin theme, public theme, buttons, cards, forms, badges, tables, toast)
- [x] Setup root layout + landing page
- [x] Create auth pages (login, denied)
- [x] Create admin layout (sidebar + topbar) + dashboard placeholder
- [x] Create `lib/utils.ts` (slug, date, truncate, reading time, file size)
- [x] Verify `pnpm dev` runs successfully — all 4 routes working

## Fase 2: Frontend (Dummy Data)
- [ ] 2.1 — Auth Pages + Admin Layout (polish)
- [ ] 2.2 — Dashboard + Post Management UI
- [ ] 2.3 — Pages, Media, Categories, Tags UI
- [ ] 2.4 — Users, Settings, Themes, Profile UI
- [ ] 2.5 — Public Pages (Theme Templates)

## Fase 3: Backend
- [ ] DB schema + migrations
- [ ] Auth.js + middleware
- [ ] API routes
- [ ] Theme engine + public rendering
- [ ] Telegram, RSS, Sitemap, SEO
