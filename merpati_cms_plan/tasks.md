# MERPATI-CMS — Implementation Plan & Task Checklist

**MERPATI** — *Media Editorial Ringkas, Praktis, Aman, Tetap Independen*

---

## Phase 1: Init "Hello World"
**Goal:** Establish the foundation, ensure the application runs, builds, and lints without errors.

- [x] **1.1 Project Setup**
  - Initialize Next.js 15 App Router project (`npx create-next-app@latest`).
  - Configure TypeScript, ESLint, and Prettier.
  - Set up standard directory structure (`app/`, `components/`, `lib/`).
- [x] **1.2 Clean Up & Hello World**
  - Remove default Next.js boilerplate.
  - Create a simple "Hello World" page at `/`.
  - Create a simple "Admin Hello World" page at `/admin`.
- [x] **1.3 CI/CD Verification**
  - Run `pnpm lint` and resolve any warnings.
  - Run `pnpm build` to ensure a successful production build.
  - (Optional) Push to Vercel and verify the live deployment.

---

## Phase 2: Design & UI Components (Dummy Data)
**Goal:** Install view libraries, build all components, and make them interactive using getters/setters with dummy data. No real database yet.

### 2.1 CSS & UI Foundation
- [x] Setup base CSS / Vanilla CSS variables (colors, typography from `design.md`).
- [x] Create base UI primitives (Buttons, Inputs, Cards, Badges, Toast notifications).

### 2.2 Admin Layout & Navigation
- [x] Build `Sidebar` component (navigation links).
- [x] Build `TopBar` component (user profile menu placeholder).
- [x] Create the main `(admin)/layout.tsx` wrapper.

### 2.3 Post Management UI
- [x] Build `PostTable` component (list of posts with dummy data, pagination UI, status filters).
- [x] Build `ClassicEditor` component (toolbar, contenteditable area, HTML toggle).
- [x] Build `SEOPanel` and `PublishBox` sidebar components for the editor.

### 2.4 Media & Taxonomy UI
- [x] Build `MediaLibrary` component (grid view of dummy images, upload button UI).
- [x] Build `CategoryManager` component (split view: list + add new).
- [x] Build `TagInput` component (chip-style input for the editor).

### 2.5 Settings & Profile UI
- [x] Build `Settings` page tabs (General, SEO defaults, Telegram setup).
- [x] Build `Profile` page UI.

### 2.6 Public Theme UI
- [x] Create `ThemeEngine` scaffolding (mock class).
- [x] Build default theme static layout (Header, Footer, Post List, Single Post) using dummy data.

---

## Phase 3: Backend & Integration
**Goal:** Install database/auth libraries, set up Neon DB, implement real API routes, and update getters/setters.

### 3.1 Database & ORM Setup
- [x] Install Drizzle ORM and `@neondatabase/serverless`.
- [x] Define full database schema in `drizzle/schema.ts`.
- [x] Implement `init.sql` for WordPress-style automatic DB initialization (no CLI migrations).
- [x] Set up Neon database connection helper (`lib/db/index.ts`).

### 3.2 Authentication Integration
- [x] Install Auth.js (NextAuth v5).
- [x] Configure Google OAuth provider.
- [x] Implement user verification logic (first user = Super User, others = invite only).
- [x] Protect `/(admin)` routes using middleware.

### 3.3 Core API Implementation (RPC Style)
- [x] Implement the core `POST /api/rpc` endpoint handler.
- [x] Implement action handlers for Posts (`posts.list`, `posts.get`, `posts.create`, etc.).
- [x] Implement action handlers for Categories & Tags.
- [x] Implement action handlers for Settings & Users.
- [x] Implement Vercel Blob integration for Media uploads (`POST /api/media` - kept separate for multipart parsing).

### 3.4 UI Data Binding
- [x] Replace Phase 2 dummy data getters/setters with `fetch` calls to the new real APIs.
- [x] Wire up the Classic Editor to save to the database.
- [x] Wire up the Media Library upload to Vercel Blob.

### 3.5 Final Polish & Verification
- [x] Run comprehensive `pnpm lint`.
- [x] Run `pnpm build` to verify type safety and server-side rendering.
- [x] Test the full Initialization → Login → Create Post → Publish flow.
