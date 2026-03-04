# Module 5: Media Library

## Requirements
Provide an interface for uploading and managing media (images). Media should be uploaded directly to Vercel Blob or referenced via public URL. The library must be accessible standalone and from within the Classic Editor.

## UI Structure
*   **Media Gallery (`/admin/media`):**
    *   A grid view of image thumbnails.
    *   A prominent upload zone (drag and drop or file select).
    *   Clicking an image opens a dialog showing details (Filename, Size, Dimensions, Upload Date) and a "Copy URL" button.
*   **Editor Media Modal:**
    *   Triggered from the TipTap toolbar.
    *   Tabs: "Upload", "Media Library", "Insert from URL".
    *   Selecting an image inserts an `<img>` tag into the editor at the cursor position.

## Data & API
*   **Media Schema:** `media` table (`id`, `url`, `filename`, `mime_type`, `size`, `alt_text`, `author_id`, `created_at`).
*   **API/Actions:**
    *   Server action wrapping `@vercel/blob` `put` method for secure uploads.
    *   Action to fetch paginated media for the grid view.
    *   Action to delete media (removes from Blob storage AND database).

## Technical Implementation
*   **Vercel Blob SDK:** Direct integration in Next.js server actions.
*   **TipTap Integration:** Create or utilize a custom Image extension for TipTap that opens the aforementioned `shadcn/ui` Dialog containing the Media Gallery component.
*   **Image Rendering:** Strictly use the standard HTML `<img>` tag instead of the Next.js `<Image />` component across the frontend and editor. This ensures users can insert public image URLs from any arbitrary domain without causing Next.js domain host configuration errors.
