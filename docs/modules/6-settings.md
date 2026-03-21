# Module 6: Settings & Notifications

## Requirements
Implement global key-value settings management and the Telegram Bot notification layer for key CMS events.

## UI Structure
*   **Settings Screen (`/admin/settings`):**
    *   **General Tab:** Site Title, Tagline.
    *   **Contacts Tab:** A dynamic list of contact links (CRUD and drag-to-reorder) managing a JSON array. Each item has: Title, Icon ID (string, e.g., 'facebook', 'twitter', 'mail'), and URL.
    *   **Notifications Tab:** Telegram Bot Token, Telegram Chat ID, Toggle for "Notify on New Post", Toggle for "Notify on New User".
    *   Save changes button.

## Data & API
*   **Settings Schema:** `options` table (`key` (varchar, unique), `value` (text), `autoload` (boolean)). The Contacts list will be stored as serialized JSON under the key `site_contacts`.
*   **Settings API:** `getOption(key)`, `setOption(key, value)` utility server actions.
*   **Telegram Notification Logic:**
    *   A utility function `sendTelegramAlert(message)` that loads the Bot Token and Chat ID from the `options` table.
    *   If both are configured, it executes a fetch POST request to `https://api.telegram.org/bot<token>/sendMessage` with the chat ID and message.

## Technical Implementation
*   **UI Components:** Use `@hello-pangea/dnd` (or similar modern drag-and-drop library) to implement the reorderable list in the Contacts tab.
*   **Event Hooks:**
    *   In the `createPost` action (if status gets set to Published) or `updatePost` action (if status transitions from Draft to Published), trigger `sendTelegramAlert("New Post Published: [Title] - [URL]")`.
    *   In the OAuth callback or `inviteUser` flow, trigger `sendTelegramAlert("New user joined the CMS: [Email]")`.
*   **Async Execution:** Ensure the Telegram fetch call does not block the standard response time of the CMS actions (e.g., wrap in `waitUntil` if deploying on Vercel EDGE/Serverless functions).
