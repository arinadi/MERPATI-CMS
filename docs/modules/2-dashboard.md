# Module 2: Dashboard & User Roles

## Requirements
Build out the admin interface shell using `shadcn/ui` and implement the invite-only user management system. Only the `Super User` can invite new authors.

## UI Structure
*   **Admin Layout Shell (`/admin`):**
    *   **Sidebar:** Navigation links (Dashboard, Posts, Pages, Media, Users, Settings). Must follow a **mobile-first** approach, using a sheet/overlay for mobile and expanding to a sidebar on desktop.
    *   **Top Header:** Breadcrumbs, current date/time, and a User Profile dropdown (Logout, Settings).
*   **Users Management (`/admin/users`):**
    *   **Mobile-First Tables:** Data tables must be responsive. On mobile, hide non-essential columns (Email, Joined Date) and use a dense, card-like view or vertically stacked layout.
    *   **Primary Actions:** "Invite User" button should be prominently placed (e.g., top right or FAB on mobile).
    *   **Dialogs:** Modals/Dialogs must be full-screen on small screens (`sm:max-w-[425px]` logic) for optimal touch-screen input.

## Data & API
*   **Invitations Schema:** Create an `invitations` table (`email`, `token`, `expires_at`, `status`).
*   **Auth Logic:** Modify the Auth.js `signIn` callback. When a new Google user attempts to log in, verify against the `users` table or the `invitations` table. If they are not invited and not the first user, reject the login.
*   **Server Actions:**
    *   `inviteUser({ email })`: Generates a token and sends an invite link (or just logs the invite record, since Google OAuth will just check if their email is in the allowed list). Actually, simplified approach: simply add their email to the `users` table with a 'pending' state or just a record indicating they are allowed to OAuth.
*   **RBAC Utility:** Provide a `checkRole(allowedRoles)` helper function to restrict UI and Actions.

## Technical Implementation
*   **Components:** Leverage `shadcn/ui` for `Sidebar` (Sheet-based for mobile-first), `Table`, `Dialog`, `DropdownMenu`, `Button`, `Input`.
*   **Validation:** Use Zod for form validation on the invite email.
