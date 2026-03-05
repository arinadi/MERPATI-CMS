# MERPATI-CMS — Global Architecture & Module Orchestration

---

## Global Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js (App Router) | Best path for Vercel Serverless deployment, Server Actions, React Server Components. |
| **Language** | TypeScript | Type safety across the stack. |
| **Database** | Neon DB (Serverless Postgres) | Native serverless scaling over HTTP, generous free tier. |
| **ORM / Data Access** | Drizzle ORM | Edge-compatible, extremely lightweight, great DX in Next.js. |
| **Authentication** | Auth.js (NextAuth) v5 | Standard for Google OAuth, utilizing JWT strategy for Edge compatibility. |
| **Media Storage** | Vercel Blob | Free tier available, native Next.js integration for media uploads. |

---

## Global Design Rules

### Admin Interface (Dashboard/Editor)
* **Styling Framework:** **Tailwind CSS v4 + `shadcn/ui`**.
* **Palette:** Sleek, modern dashboard feel (Slate/Zinc grayscale with a refined primary accent color).
* **Typography:** System fonts (e.g. Inter/Geist via Next.js `next/font`), clear hierarchical type scale.
* **Component Strategy:** Rely on `shadcn/ui` for high-quality, accessible interactive primitives (Dropdowns, Dialogs, Data Tables, Forms).
* **Responsiveness:** 
    *   **Mobile-First Editing:** Prioritize the writing experience on small screens with a sticky bottom action bar (Save/Publish) and a specialized Sheet for metadata (Categories, Tags, Slug).
    *   **Adaptive Sidebar:** Uses `shadcn/ui` sidebar (sheet on mobile, persistent on desktop).
    *   **Thumb-Friendly Targets:** All buttons, inputs, and touch targets meet minimum 44px height for reliable mobile interaction.

### Public Interface (Front-end)
* **Styling Framework:** **Pure Tailwind CSS v4** (Strictly NO `shadcn/ui` or component library dependencies).
* **Palette & Typography:** Defined entirely by the active file-based theme.
* **Component Strategy:** Rely on semantic HTML and raw Tailwind utility classes to ensure a near-zero client JS footprint and maximum performance.
* **Responsiveness:** Strict mobile-first implementation to prioritize the vast majority of readers on mobile devices.

---

## Module Orchestration

These modules are the step-by-step roadmap. Each depends on the successful completion of the previous one. **Do not proceed to a module until the current one is tested and verified.**

> **Note on Database Initialization (`init.sql` & `seed.sql`):** 
> Instead of using standard migration workflows, this project relies on raw `init.sql` (schema) and `seed.sql` (default data) for runtime self-initialization. 
> The code agent MUST generate/update `init.sql` (e.g., via `drizzle-kit generate` or manually) and append relevant data to `seed.sql` **incrementally within each module** as new schemas are introduced.

- **Module 0: Setup & Infrastructure**
  - Next.js scaffolding, Drizzle ORM setup, Database connection mapping (Neon serverless HTTP), and the strict styling infrastructure split mapping (Admin Tailwind vs Public Tailwind).

- **Module 1: CMS Initialization & Authentication (WP-like Setup)** *(Depends on 0)*
  - **Setup Wizard UI:** A dedicated `/setup` flow (WP-like install screen) active only if the DB is uninitialized, capturing Site Title and Tagline.
  - **Bootstrap:** Automatic execution of `init.sql` to scaffold tables, bypassing CLI migrations. *(Note: The agent must create the initial `init.sql` here mapping the Auth schema).*
  - **Auth & Super User:** Auth.js v5 Google OAuth implementation (using JWT strategy) where the first authenticated user claims the `Super User` role.
  - **Seed Content:** Execute `seed.sql` to populate DB with default relevant content. *(Note: The agent must create the initial `seed.sql` here, ensuring the Welcome Post and Page highlight the "Media Editorial Ringkas, Praktis, Aman, Tetap Independen" theme).*
  - **Middleware:** Intercept and redirect to `/setup` if uninitialized, and secure `/admin/*` routes.

- **Module 2: Dashboard & User Roles** *(Depends on 1)*
  - Build out the `shadcn/ui` Admin layout shell (Sidebar + Header).
  - RBAC (Role-Based Access Control) utility.
  - The invite-only UI system for the Super User to add new authors.

- **Module 3: Publishing Engine (Posts & Pages)** *(Depends on 1, 2)*
  - Establish `posts` schema for both posts and static pages.
  - Integrate a Classic Editor (e.g., TipTap) supporting bold, italic, lists, headings, and media insertion, with HTML toggle and autosave.
  - Post status management (Draft, Published) and strict DOMPurify sanitization (No comment system).

- **Module 4: Taxonomies (Categories & Tags)** *(Depends on 3)*
  - Taxonomy relational schema (terms, term_relationships).
  - Admin UI for managing hierarchical categories and flat tags.
  - Sidebar editor integration.

- **Module 5: Media Library** *(Depends on 3)*
  - Vercel Blob SDK direct upload integration, plus input via public image URLs.
  - Admin grid view for managing media, including image metadata extraction and quick "copy URL" action.
  - Editor integration for inserting images.

- **Module 6: Settings & Notifications** *(Depends on 1, 2, 3)*
  - Key-value schema for global sites options (Title, Tagline, dynamic Contact Links).
  - Telegram Bot push API layer hooking into User Invites and Post Publish events.

- **Module 7: Theme System (Public Frontend)** *(Depends on 0, 3, 4)*
  - Establish `/[...slug]` dynamic route.
  - Handlebars (`.hbs`) server-side template resolution engine.
  - True file-based fallback and resolution logic enabling child themes.

- **Module 8: SEO & Share Engine** *(Depends on 7)*
  - Next.js Metadata API mapping (Open Graph, Twitter).
  - Schema.org JSON-LD generation for articles.
  - Dynamic `sitemap.xml`, `news-sitemap.xml`, and RSS feed endpoints.

- **Module 9: Menus (Navigation Manager)** *(Depends on 3, 4)*
  - `menus` and `menu_items` schema for drag-and-drop navigation.
  - Linking support for raw URLs, Posts, Pages, and Categories.
  - Theme location assignment (e.g., Main Menu, Footer Menu).
