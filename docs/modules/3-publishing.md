# Module 3: Publishing Engine (Posts & Pages)

## Requirements
Implement the core content creation engine. Provide a WP-like Classic Editor (HTML-based) for writing posts and static pages. Handle autosave, drafts, and strict content sanitization.

## UI Structure
*   **Content Listing (`/admin/posts` and `/admin/pages`):** Data tables showing Title, Author, Status (Draft/Published), Date. Includes bulk actions or individual row actions to Edit/Delete.
*   **Editor UI (`/admin/posts/new` or `[id]`):**
    *   **Main Area:** Large, distraction-free input for the Post Title. Below it, the rich-text Classic Editor (bold, italic, lists, headings, media insert). Includes an "HTML toggle" mode to edit raw HTML.
    *   **Sidebar/Metadata:** 
        *   **Desktop:** Visible secondary grid column (320px).
        *   **Mobile-First:** Tucked into a **Sticky Header Metadata Sheet** (Settings Gear icon). Avoid vertical stacking to keep the editor content prioritized.
    *   **Sticky Actions:** On small screens, the primary "Publish/Save" button must be pinned to a **Sticky Bottom Bar** or the **Sticky Header**, ensuring accessibility regardless of content length.

## Data & API
*   **Posts Schema:** `posts` table (`id`, `title`, `slug` (unique), `content` (text/HTML), `excerpt`, `status`, `type` ('post' | 'page'), `author_id` (fk), `featured_image` (url/string, nullable), `created_at`, `updated_at`).
*   **Related Posts Schema:** `post_relationships` mapping table (`post_id`, `related_post_id`, both fk to `posts.id`).
*   **Data Fetching:** Server actions to fetch paginated posts, fetch single post by ID (including its relations). An API endpoint or server action to search published posts for the "Related Posts" dropdown.
*   **Mutations:** Server actions for `createPost`, `updatePost`, `deletePost`. Implementation of an autosave mechanism (debounced client-side calls to `updatePost`). Updating a post must also sync its related posts relationships.

## Credits (Reporter & Editor)
*   **What:** A post can name any number of **Reporters** and **Editors** (all optional). Each entry is a *person*: either an **account** (an existing user) or a **plain-text name**. They are credits for the byline; they give no extra permissions.
*   **UI:** Two tags-style multi-selects, "Reporter" and "Editor", in the post editor sidebar (posts only, not pages). Typing a name that is not in the list adds it as a plain-text person and selects it.
*   **People list (shared, reusable):** One list for both roles. It holds every active user (id `user:<userId>`, name read live from the account) and every plain-text person that anyone added (id `p:<uuid>`). A name added once is offered on every other post. Adding a name that already exists (ignoring case and extra spaces) selects the existing entry instead of creating a duplicate. Empty names are rejected. Any logged-in user may add a name.
*   **Storage (no schema change):** `options` rows with `autoload = false`. A plain-text person is `credit_person:<uuid>` = JSON `{"name": "..."}` (one row per person, so concurrent adds cannot overwrite each other). A post's credits are `post_reporters:<postId>` and `post_editors:<postId>` = JSON array of person ids, in display order. An empty list deletes the row. Deleting a post (single or bulk) deletes its credit rows. Credits saved by the first version (`post_reporter:<postId>` / `post_editor:<postId>` = user id) are still read as `["user:<id>"]` and are replaced by the new row the next time that role's list is saved.
*   **Mutations:** `createPost` and `updatePost` accept `reporterIds` and `editorIds` (arrays; `[]` clears). An id that is not an existing user or person is rejected and nothing is saved. Omitting the field leaves the credit as it is. `createCreditPerson(name)` adds (or finds) a plain-text person; `getCreditPeople()` lists the people for the selects. Both need a logged-in user.
*   **Reading:** `getPostById` and `getPostBySlug` return `reporterIds` and `editorIds`. The public post query returns `reporters` and `editors` as `{ name }[]`; a person whose account or name no longer exists, or an account without a name, is left out (emails are never shown publicly).
*   **Public output:** Each theme's single post shows "Reporter: A, B" and "Editor: C" in the byline when set. JSON-LD `author` is the reporters (else the post author) and `editor` is added when there are editors.

## Technical Implementation
*   **Editor Choice:** TipTap (or similar headless editor) initialized with StarterKit. Custom extensions for image insertion (tied to our future Media Library) and standard formatting.
*   **Sanitization (CRITICAL):** Use `isomorphic-dompurify` on the server action *before* inserting or updating `content` in the database to prevent XSS. Strip out `<script>` and potentially dangerous attributes.
*   **Routing:** Client-side router updates when navigating from `/new` to `/[id]` seamlessly after initial autosave.
