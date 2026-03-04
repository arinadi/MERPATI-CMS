# Module 2: Dashboard & User Roles

## Requirements
Build out the admin interface shell using `shadcn/ui` and implement the invite-only user management system. Only the `Super User` can invite new authors.

## UI Structure
*   **Admin Layout Shell (`/admin`):**
    *   **Sidebar:** Navigation links (Dashboard, Posts, Pages, Media, Users, Settings). Must be collapsible and responsive on mobile.
    *   **Top Header:** Breadcrumbs, current date/time, and a User Profile dropdown (Logout, Settings).
*   **Users Management (`/admin/users`):**
    *   Data table listing existing users (Name, Email, Role, Joined Date).
    *   "Invite User" button (visible only to Super User).
    *   Modal/Dialog for entering the email address to invite.

## Data & API
*   **Invitations Schema:** Create an `invitations` table (`email`, `token`, `expires_at`, `status`).
*   **Auth Logic:** Modify the Auth.js `signIn` callback. When a new Google user attempts to log in, verify against the `users` table or the `invitations` table. If they are not invited and not the first user, reject the login.
*   **Server Actions:**
    *   `inviteUser({ email })`: Generates a token and sends an invite link (or just logs the invite record, since Google OAuth will just check if their email is in the allowed list). Actually, simplified approach: simply add their email to the `users` table with a 'pending' state or just a record indicating they are allowed to OAuth.
*   **RBAC Utility:** Provide a `checkRole(allowedRoles)` helper function to restrict UI and Actions.

## Technical Implementation
*   **Components:** Leverage `shadcn/ui` for `Sidebar` (or custom responsive nav), `Table`, `Dialog`, `DropdownMenu`, `Button`, `Input`.
*   **Validation:** Use Zod for form validation on the invite email.
