# MERPATI — Media Editorial Ringkas, Praktis, Aman, Tetap Independen

> *"Kebebasan pers dimulai dari kemandirian infrastrukturnya."*

---

## Phase 0: Project Context

| Field | Value |
|---|---|
| **Project Type** | Greenfield |
| **Existing Assets** | None |
| **Constraints** | Vercel Free Tier (Single Endpoint Serverless Function) |
| **Target Users** | Digital publishers and journalists seeking a modern, zero-cost WordPress alternative |

---

## The Story (The Pain)

Publishers and journalists are accustomed to the intuitive UI/UX of WordPress, but its legacy architecture and hosting costs can be burdensome. **MERPATI** resolves this by delivering a familiar, rich publishing experience powered by a modern, serverless backend. It is designed to deploy entirely on Vercel's Free Tier using a *single endpoint serverless function*, eradicating hosting costs while drastically improving performance and security.

---

## Core Features (NO CAPES!)

1. **📝 Classic Editor**: A familiar, WordPress-style editor supporting bold, italic, lists, headings, and media insertion. Includes HTML toggle and autosave functionality. *(Note: No comment system—focus entirely on modern publishing).*
2. **📷 Media Library**: Direct upload integration with Vercel Blob or input via public image URLs. Features a grid view, image metadata extraction, and quick "copy URL" action.
3. **🎨 Modular Theme System (RSC)**: React Server Components natively integrated into an isolated `/themes` directory. Offers maximum Vercel Serverless performance and security while allowing designers to build freely using Tailwind CSS v4. Active theme is determined via build-time environment variables.
4. **👤 User Management (Invite-Only)**: Strictly Google OAuth 2.0. The very first user to log in automatically becomes the `Super User`. The Super User can invite others. Roles are simplified to `super_user` and `user`. All authenticated users have publishing rights.
5. **🔔 Telegram Notifications**: Automated push notifications sent to a configured Telegram channel whenever a new user joins or a new post is published.
6. **🔗 Share & SEO Engine**: Out-of-the-box technical SEO including Open Graph, Twitter Cards, `NewsArticle` JSON-LD, Sitemap generation (`/sitemap.xml`, `/news-sitemap.xml`), and RSS Feed.
7. **🧭 Navigation Menus**: Drag-and-drop menu management allowing custom links and assignments to specific theme locations (e.g., Main Menu, Footer Menu).

---

## Base Features (CRUD Details)

- **Posts**: Create, Read, Update, Delete posts. Status management (Draft/Published).
- **Taxonomies**: Tag and category management.
- **Pages**: Static page management using the Classic Editor.
- **Settings**: Global configuration (Title, Tagline, Telegram API) and a dynamic, reorderable Contact Links list.
- **Menus**: Custom navigation structures connecting to URLs, Posts, Pages, or Categories.

---

## User Flow

### Initialization Flow
*The system self-initializes on the first run, completely bypassing CLI DB migrations.*
1. **Bootstrap**: If the database is empty, automatically execute `init.sql` to scaffold the necessary tables.
2. **Super User Claim**: The first person to authenticate via Google OAuth is permanently assigned the `Super User` role.
3. **Seed Content**: Execute `seed.sql` to populate the database with default categories, tags, settings, a welcome post, and a welcome page. Ensure the seeded content highlights the theme: *"Media Editorial Ringkas, Praktis, Aman, Tetap Independen"*, and is assigned to the Super User.

---

## Non-Functional Requirements

- **Performance**: Admin interface must respond in **< 500ms** (SPA-like feel). Public-facing pages must respond in **< 200ms** utilizing ISR (Incremental Static Regeneration) caching.
- **Security**: Strict Google OAuth 2.0 (JWT) for authentication. Mandatory DOMPurify sanitization on all raw HTML inputs to prevent XSS.
- **Scalability**: Serverless architecture optimized for edge delivery and single-endpoint execution.
- **UI Architecture**: Admin interface built with **Tailwind CSS v4** and **shadcn/ui**. Public-facing frontend relies on **React Server Components (RSC)** stored in an isolated `/themes` directory using pure Tailwind CSS v4 (no component library dependencies) for maximum performance and caching synergy.

---

## Success Criteria

- [ ] Successfully deploys to Vercel Free Tier as a single endpoint function.
- [ ] Admin interface feels instantly familiar to WordPress users.
- [ ] Zero-touch initialization works flawlessly on the first run with relevant seed content.
- [ ] Both performance targets (< 500ms admin, < 200ms public) are met consistently.
