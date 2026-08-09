# Module 1: CMS Initialization & Authentication

## Requirements
Implement the WP-like setup flow, automatic database bootstrapping, and Google OAuth authentication. The very first user to log in claims the `Super User` role. The system must seed initial data during setup and restrict access to `/admin` routes.

## UI Structure
*   **Setup Wizard (`/setup`):** A dedicated WP-like install screen.
    *   Form: Site Title, Site Tagline.
    *   Button: "Install & Initialize" (creates schema, seeds data, redirects to login).
*   **Login Page (`/login`):** A clean, simple page with a "Sign in with Google" button.

## Data & API
*   **Auth Schema:** Standard Auth.js schema (`users`, `accounts` - since we use JWT, `sessions` might be omitted but keep standard definitions if required by adapters, or just rely entirely on JWT logic without DB sessions). Add `role` enum (`super_user`, `user`) to `users`.
*   **Settings Schema:** `options` table (keys like `site_title`, `site_tagline`, `is_initialized`).
*   **Seed Content:** During bootstrap, automatically execute `seed.sql` to insert highly relevant content (Welcome Post, Welcome Page focusing on "Media Editorial Ringkas, Praktis, Aman, Tetap Independen" theme), default categories, and tags. Assign authored content to the newly claimed Super User.
*   **API/Action:** Server Action to handle the Setup form submission (creates tables using raw `init.sql` execution, inserts seeded options).

## Technical Implementation
*   **Authentication:** Auth.js v5 (NextAuth) using Google OAuth Provider. Configured to use the **JWT strategy** for Edge compatibility.
*   **Middleware (`middleware.ts`):**
    *   Check if `is_initialized` is true (cache this aggressively or check via edge-compatible KV). If not, redirect `/` and `/admin/*` to `/setup`.
    *   If initialized, intercept `/admin/*` routes to ensure the user is authenticated via JWT token. Redirect unauthenticated to `/login`.
*   **Bootstrap Logic:** A script or Server Action that runs raw SQL (`init.sql`) to ensure tables exist in the Neon HTTP database.
