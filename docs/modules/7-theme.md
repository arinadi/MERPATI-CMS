# Module 7: Theme System (Public Frontend)

## Requirements
Build the public-facing frontend using Next.js **React Server Components (RSC)**. To support clean separation and allow AI agents (or frontend devs) to build themes without touching the core CMS logic, we will isolate theme files into a modular `/themes` directory. The CMS will resolve which theme to import at build time based on an environment variable, ensuring 100% Serverless efficiency.

## UI Structure
*   **Theme Directory (`/themes`):** Placed at the project root (outside `app/`). Each theme is a folder (e.g., `default/`, `magazine/`).
*   **Theme Interface (Required Exports):** Each theme folder MUST export a standard set of React Server Components from its `index.tsx`:
    *   `ThemeLayout`: Wrapping header/footer layout.
    *   `SinglePost`: Template for articles.
    *   `SinglePage`: Template for statical pages.
    *   `Archive`: Template for categories, tags, and the homepage.
    *   `NotFound`: Custom 404 template.
*   **Core Routing (`app/(public)/layout.tsx` & `app/(public)/[...slug]/page.tsx`):**
    *   These core files will dynamically import the active theme's components based on `process.env.ACTIVE_THEME` (e.g., `import { SinglePost } from '@/themes/default'`).

## Data & API
*   **Routing Logic:**
    *   The `page.tsx` catch-all route determines the entity type (Category, Post, Page, or Home).
    *   Fetches the necessary data from the Database (via Drizzle).
    *   Passes the pure data object as a prop to the corresponding theme component (e.g., `<SinglePost post={postData} />`).
    *   The theme component is solely responsible for rendering the UI using Tailwind CSS v4, following a strict **mobile-first** philosophy.

## Technical Implementation
*   **100% React Server Components:** Themes are standard async RSCs. No Handlebars, no `fs` reads at runtime.
*   **Tailwind v4 Integration:** Each theme can have its own `globals.css` or rely on the root Tailwind configuration.
*   **Caching & ISR:** Perfect synergy with Next.js App Router Data Cache. The entire page is static and revalidated via `revalidatePath` when CMS content changes. Response times will easily hit < 50ms.
*   **No Dynamic Child Themes:** Changing the active theme requires updating the `.env` file and triggering a Vercel Rebuild. This is the trade-off for maximizing Serverless performance and security on the Free Tier.
