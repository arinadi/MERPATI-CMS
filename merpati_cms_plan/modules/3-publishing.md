# Module 3: Publishing Engine (Posts & Pages)

## Requirements
Implement the core content creation engine. Provide a WP-like Classic Editor (HTML-based) for writing posts and static pages. Handle autosave, drafts, and strict content sanitization.

## UI Structure
*   **Content Listing (`/admin/posts` and `/admin/pages`):** Data tables showing Title, Author, Status (Draft/Published), Date. Includes bulk actions or individual row actions to Edit/Delete.
*   **Editor UI (`/admin/posts/new` or `[id]`):**
    *   **Main Area:** Large, distraction-free input for the Post Title. Below it, the rich-text Classic Editor (bold, italic, lists, headings, media insert). Includes an "HTML toggle" mode to edit raw HTML.
    *   **Sidebar:** Status toggle (Draft/Published), Post URL slug editor, Publish Button, Autosave indicator, **Featured Image** selector (opens Media Library module), and a **Related Posts** search-and-select multiselect box.

## Data & API
*   **Posts Schema:** `posts` table (`id`, `title`, `slug` (unique), `content` (text/HTML), `excerpt`, `status`, `type` ('post' | 'page'), `author_id` (fk), `featured_image` (url/string, nullable), `created_at`, `updated_at`).
*   **Related Posts Schema:** `post_relationships` mapping table (`post_id`, `related_post_id`, both fk to `posts.id`).
*   **Data Fetching:** Server actions to fetch paginated posts, fetch single post by ID (including its relations). An API endpoint or server action to search published posts for the "Related Posts" dropdown.
*   **Mutations:** Server actions for `createPost`, `updatePost`, `deletePost`. Implementation of an autosave mechanism (debounced client-side calls to `updatePost`). Updating a post must also sync its related posts relationships.

## Technical Implementation
*   **Editor Choice:** TipTap (or similar headless editor) initialized with StarterKit. Custom extensions for image insertion (tied to our future Media Library) and standard formatting.
*   **Sanitization (CRITICAL):** Use `isomorphic-dompurify` on the server action *before* inserting or updating `content` in the database to prevent XSS. Strip out `<script>` and potentially dangerous attributes.
*   **Routing:** Client-side router updates when navigating from `/new` to `/[id]` seamlessly after initial autosave.
