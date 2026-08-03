# Module 9: Menus

## Requirements
Implement a flexible navigation menu system. Users should be able to create custom menus (e.g., "Main Menu", "Footer Menu") and add items linking to custom URLs, existing Posts/Pages, or Categories. 

## UI Structure
*   **Menu Manager (`/admin/menus`):**
    *   **Select Menu:** Dropdown to switch between editing different menus (e.g., "Main", "Footer"). If none exist, ability to create one.
    *   **Sidebar (Add Items):** Accordion sections allowing the user to select and add:
        *   Custom Links (URL and Link Text).
        *   Posts/Pages (Checkboxes of recently published content).
        *   Categories (Checkboxes of existing categories).
    *   **Main Area (Menu Structure):** A drag-and-drop list of the added menu items. Each item can be expanded to edit its label or URL (if custom). Support for basic nested hierarchies (sub-menus) is highly recommended, but a flat list is acceptable for V1.
    *   **Menu Settings:** Checkboxes to assign the current menu to a specific theme location (e.g., "Primary Header", "Footer Links").

## Data & API
*   **Menus Schema:** `menus` table (`id`, `name`, `slug` (unique), `location`).
*   **Menu Items Schema:** `menu_items` table (`id`, `menu_id` (fk), `title`, `url` (for custom links), `object_id` (reference to `posts.id` or `terms.id`, nullable), `type` ('custom' | 'post' | 'page' | 'category'), `parent_id` (self-referencing fk for sub-menus, nullable), `sort_order` (integer)).
*   **API/Actions:**
    *   CRUD operations for `menus` and `menu_items`.
    *   Drizzle queries to fetch a menu by its location (e.g., fetching the "Primary Header" menu) sorted by `sort_order` for the public frontend.

## Technical Implementation
*   **UI Components:** Utilize `@hello-pangea/dnd` for the drag-to-reorder interface in the admin panel. 
*   **URL Resolution:** When rendering the menu on the public frontend, if a menu item is a 'post', 'page', or 'category', dynamically query and resolve its current URL slug from the database (in case the slug was changed), or pre-calculate the safe URL path during the menu save process.
