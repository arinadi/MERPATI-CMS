# Module 4: Taxonomies (Categories & Tags)

## Requirements
Implement the taxonomy engine to organize content. Categories must support a hierarchical structure (parent-child), while Tags are flat. Embed this management into the Editor sidebar.

## UI Structure
*   **Management Views (`/admin/categories` & `/admin/tags`):**
    *   Left column: Add new term form (Name, Slug, Parent Dropdown for Categories).
    *   Right column: Data table listing existing terms with edit/delete actions.
*   **Editor Sidebar Integration:**
    *   **Categories:** A scrollable list of checkboxes representing the category hierarchy.
    *   **Tags:** A Combobox/Autocomplete input allowing users to search existing tags or create new ones on the fly (hitting Enter).

## Data & API
*   **Terms Schema:** `terms` table (`id`, `name`, `slug` (unique), `taxonomy` ('category' | 'tag'), `parent_id` (self-referencing fk for categories), `description`).
*   **Relationships Schema:** `term_relationships` mapping table (`object_id` referencing `posts.id`, `term_id` referencing `terms.id`).
*   **API/Actions:** CRUD server actions for terms. A specific action to sync a post's terms during the `updatePost` or `createPost` flow (clearing old relationships, inserting new ones).

## Technical Implementation
*   **Database Queries:** Drizzle recursive queries (or application-level sorting) to build the category tree.
*   **UI Components:** Leverage `shadcn/ui` Command and Popover components to build a robust multi-select tag input in the TipTap editor sidebar.
