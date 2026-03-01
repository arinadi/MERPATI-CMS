# MERPATI-CMS — Implementation Instruction for Agentic Coding

**MERPATI** — *Media Editorial Ringkas, Praktis, Aman, Tetap Independen*

> Phase 4 deliverable per Agent EDNA methodology.

---

## **Context Links (CRITICAL)**

Before you write any code, you must deeply understand the project by reading the following documents:
- **`PRD.md`**: Core features, user flows, and project constraints (Vercel Free Tier, invite-only auth, etc.).
- **`design.md`**: All visual requirements, UI layouts, color palettes, and mock data needs.
- **`techstack.md`**: The chosen technologies, single serverless API endpoint (RPC-style) architecture, Next.js App Router structure, and the raw SQL database initialization strategy instead of CLI migrations.

You are an autonomous AI Coding Agent. Do not ask for exact file paths or step-by-step code snippets. You must derive the technical implementation (the "how") yourself from the provided constraints and blueprints (the "what" and "why").

---

## **Phase 1: Init "Hello World"**

**Goal:** Initialize the codebase repository and CI/CD foundation. Set up the development environment locally to prove a running app can be built.

**Detailed Objectives & Logic Constraints:**
1. **Initialize Project:** Scaffold a Next.js 15 App Router project using pnpm, TypeScript, and ESLint. Read `techstack.md` to determine the exact dependencies (e.g., Drizzle ORM, @neondatabase/serverless, Auth.js). Keep dependencies minimal as required for Vercel Free Tier (9 production packages).
2. **Project Structure:** Create the base folders (`app/(auth)`, `app/(admin)`, `app/(public)`, `components`, `lib`, `themes`, etc.) as outlined in `techstack.md`.
3. **Hello World:** Render a simple "Hello World" screen on the `/` route to confirm the Next.js setup is functional.
4. **Setup/Initialization UI:** Create an initial setup screen (which will later map to the `system.setup` RPC) that accepts basic site configurations (Site Title, Tagline) and first super user details. This is necessary because we are bypassing CLI migrations in favor of runtime database initialization as specified in `techstack.md`. 
5. **Linting & Formatting:** Ensure code meets the configured ESLint and Prettier rules.

**Validation Commands:**
The agent must successfully run the following commands and ensure a clean exit before considering this phase complete:
- `pnpm install`
- `pnpm run build`
- `pnpm run lint`

### **🛑 User Review Checkpoint**
Pause execution here. Notify the user: "Phase 1 complete. Scaffolded Next.js project and confirmed build constraints. Awaiting review and approval to begin Phase 2." Do not proceed until the user explicitly approves.

---

## **Phase 2: Design & UI**

**Goal:** Build all interactive UI components, layouts, and pages using dummy data based on the design specification. No backend logic or database connections yet.

**Detailed Objectives & Logic Constraints:**
1. **Design System & Styling:** Read `design.md` deeply. Initialize Tailwind CSS. Use `shadcn/ui` components for building the admin interface (`app/(admin)`). For the public interface (`app/(public)`), use pure Tailwind CSS utility classes without relying on heavy components. Configure your `tailwind.config` and global CSS variables according to `design.md`.
2. **Admin SPA UI:** Build the shell for the admin dashboard (`app/(admin)/layout.tsx`), including the Sidebar and TopBar. 
3. **Core Features UI:** Implement the views using mock data:
   - **Post Management / Classic Editor:** Create the editor UI (`contenteditable` + custom toolbar).
   - **Data Tables:** Implement the resizable/filterable tables for Posts, Media, Categories, Tags, Users.
   - **Settings & Theme Managers:** UI for site configuration and active theme selection.
   - **Modal & Toasts:** Implement reusable UI feedback blocks.
4. **Public Theme Engine UI:** Implement the base layout for public pages that will eventually integrate with Handlebars as defined in the Theme Architecture (`PRD.md` and `techstack.md`).
5. **Interactivity:** Ensure hover states, responsive breakpoints (mobile/tablet/desktop), and micro-animations work perfectly as per `design.md`.

**Validation Commands:**
- `pnpm run build`
- `pnpm run lint`

### **🛑 User Review Checkpoint**
Pause execution here. Notify the user: "Phase 2 complete. All UI components and layouts are built with dummy data. Please review the look and feel in the browser. Awaiting approval to begin Phase 3." Do not proceed until the user explicitly approves.

---

## **Phase 3: Backend Integration**

**Goal:** Implement the serverless API, Neon Database connection, Google OAuth, and bind real data to the UI components built in Phase 2.

**Detailed Objectives & Logic Constraints:**
1. **Database Setup (Raw SQL):** Setup the database configuration. Connect to Neon DB via `@neondatabase/serverless`. Implement the raw SQL auto-initialization script that checks for table existence and runs initialization and dummy seeding on first launch (bypassing CLI migrations).
2. **Single Serverless Endpoint (RPC):** Implement the core `/api/rpc` route. This is strictly required to save Vercel free-tier limits. Route all features (posts, pages, media, users, themes) through this single RPC POST endpoint based on `techstack.md`.
3. **Authentication:** Implement Auth.js with Google OAuth. Enforce the invite-only constraint. Ensure the very first logged-in user becomes the `super_user`. Lock down API routes via middleware based on roles.
4. **Themes & Public Output:** Wire up the Handlebars theme engine. Make the public routes (`app/(public)`) fetch data from the Neon DB and hydrate the templates. Create the RSS and Sitemap routes.
5. **Data Binding:** Connect all frontend generic components (Tables, Editor, Settings) to the RPC endpoint using proper loading/error states.
6. **Telegram Integration:** Implement the one-way `fetch` call to the Telegram Bot API for notifications (Publish, Join events).

**Validation Commands:**
- `pnpm run build`
- `pnpm run lint`

### **🛑 User Review Checkpoint**
Pause execution here. Notify the user: "Phase 3 complete. Backend, DB, Auth, and Theme Engine are wired up. System is ready for E2E testing. Awaiting next instructions." Do not proceed further.
