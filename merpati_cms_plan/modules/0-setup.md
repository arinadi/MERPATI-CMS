# Module 0: Setup & Infrastructure

## Requirements
Establish the foundational infrastructure for the MERPATI-CMS project. This includes scaffolding the Next.js application, configuring the database connection using Drizzle ORM and Neon (Serverless Postgres), and setting up the dual styling environments (Admin vs. Public).

## UI Structure
*   **Base Layout:** `app/layout.tsx` - Setup fonts (Inter/Geist) and global metadata.
*   **Admin Base:** `app/admin/layout.tsx` - Placeholder for the admin dashboard shell.
*   **Public Routing Base:** `app/(public)/[...slug]/page.tsx` - Next.js catch-all route server component dynamically importing the active theme's RSCs from `/themes`.

## Data & API
*   **Database:** Neon (Serverless Postgres over HTTP).
*   **ORM:** Drizzle ORM.
*   **Connection:** Setup `db/index.ts` using `@neondatabase/serverless` and `drizzle-orm/neon-http` to instantiate the centralized DB instance.
*   **Schema Definition:** Create `db/schema.ts` (empty for now, to be populated in subsequent modules).

## Technical Implementation
*   **Framework:** Next.js (App Router).
*   **Styling (Admin):** Tailwind CSS v4, initialized with `shadcn/ui` for the `/admin` path only. Ensure the global `admin.css` includes the necessary variables.
*   **Public Delivery:** Next.js React Server Components natively importing standalone theme components from `/themes`. Pure Tailwind CSS v4 support, fully isolated from `shadcn/ui`.
*   **Config:** `drizzle.config.ts` configured to point to `DATABASE_URL` for local migrations/introspections.
