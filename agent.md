# MERPATI-CMS Agent Context & Development Guide

## 1. Project Identity & Philosophy
**MERPATI** (Media Editorial Ringkas, Praktis, Aman, Tetap Independen) is a modern, serverless publishing platform designed as a zero-cost WordPress alternative for journalists.

### Core Philosophy: "NO CAPES!"
- **Mobile-First Radicalism**: Every UI decision revolves around the mobile experience. If it doesn't work perfectly on a phone, it shouldn't exist.
- **Keep it Lean**: Focus on rich publishing (Posts, Pages, Media, Menus).
- **No Over-Engineering**: Single-endpoint serverless execution on Vercel Free Tier.
- **WP-Familiarity**: Admin UX should feel instantly recognizable to WordPress users.
- **Independence**: Zero-touch initialization and deployment.

> **💡 Technical Documentation**: All setup guides, prerequisites, and project documents are located in the `docs/` directory. Be sure to reference files within `docs/` for deeper technical context when needed.

---

## 2. Technical Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Database** | Neon DB (Serverless Postgres over HTTP) |
| **ORM** | Drizzle |
| **Auth** | Auth.js v5 (Google OAuth, JWT Strategy) |
| **Styling** | Tailwind CSS v4 (Integrated with shadcn/ui for Admin) |

### The UI Infrastructure Split
- **Admin Interface (`/admin`)**: Built with **Tailwind v4 + shadcn/ui**. Focus on productivity and mobile-first editing.
- **Public Interface**: Built with **React Server Components (RSC)** in the `/themes` directory using **Pure Tailwind v4**. Strictly NO component library dependencies for maximum performance.

### Mobile-First Design Rules
1. **Interactive Targets**: All buttons and links MUST have a minimum 44x44px hit area for mobile thumb interaction.
2. **Editor UX**: The content editor MUST use a sticky bottom action bar for Save/Publish and a specialized Sheet (drawer) for metadata to maximize writing space.
3. **Adaptive Components**: All Admin components must use the `shadcn/ui` Sidebar (collapsible) and responsive Dialogs/Sheets that convert to drawers on small screens.
4. **Performance**: Public theme components must be pure CSS/Tailwind with near-zero JavaScript to ensure instant loading on mobile networks.

---

## 3. Setup & Getting Started

### Prerequisites
- Node.js & `pnpm`.
- Neon DB connection string.
- Google OAuth credentials.
- Vercel Blob (optional for production media).

### Initial Configuration
Create a `.env.local` with:
```env
DATABASE_URL=postgres://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ACTIVE_THEME=default
```

### Runtime Initialization
MERPATI uses a "Zero-Touch" initialization strategy:
1. **The `/setup` route**: Automatically intercepts requests if the specific options table is empty.
2. **Schema & Seed**: On first run, the system executes `init.sql` (automatic via Drizzle) and `seed.sql` (default content).
3. **Super User**: The first user to authenticate via Google OAuth in a fresh installation is automatically assigned the `super_user` role.

---

## 4. Feature Development Workflow

### Adding New Schemas
1. Define the table in `db/schema.ts`.
2. Generate the SQL: `npx drizzle-kit generate`.
3. Update `lib/actions/` to include the appropriate Server Actions.
4. Ensure any default data is added to a seeding utility if necessary.

### Admin vs. Public Logic
- **Admin Components**: Place in `components/admin/`. Use shadcn primitives.
- **Public Components**: Place in `themes/[theme_name]/components/`. Use only pure Tailwind.
- **Server Actions**: Keep logic strictly in `lib/actions/` for reuse across both layers.

---

## 5. Maintenance & Hygiene

### Type Safety
- **Strict TypeScript**: Avoid `any` at all costs. Use Zod for validation where possible.
- **Schema Alignment**: Always align `db/schema.ts` with local interface definitions (e.g., in `lib/themes.ts`).

### Code Quality
- **Linting**: Run `pnpm lint` before every commit.
- **Clean Code**: Remove unused imports, icons, and variables.
- **Security**: All raw HTML input (e.g., from the editor) MUST be sanitized via `DOMPurify` before being stored or rendered.

---

## 6. Theme & Child Theme System

### Architecture
Themes are located in `/themes`. The active theme is resolved at build time via the `ACTIVE_THEME` environment variable.

### Directory Structure
```
/themes/[name]/
  ├── index.ts        # Exports required Theme components
  ├── components/     # Internal theme components
  ├── archive.tsx     # Archive/Category template
  ├── single-post.tsx # Single post template
  ├── single-page.tsx # Single page template
  └── 404.tsx         # Not found template
```

### Creating a Child Theme
Currently, child themes are implemented via file-based duplication or extending the `THEME_MAP` in `lib/themes.ts`.
1. Copy an existing theme folder (e.g., `themes/default` to `themes/my-custom-theme`).
2. Modify components and styles.
3. Register the theme in `lib/themes.ts`:
   ```typescript
   import * as myCustomTheme from "@/themes/my-custom-theme";
   const THEME_MAP = {
       default: defaultTheme,
       "my-custom-theme": myCustomTheme,
   };
   ```
4. Update `ACTIVE_THEME` in your `.env` to `my-custom-theme`.

---

*Build it fabulously. Keep it independent.*
