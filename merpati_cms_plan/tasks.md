# MERPATI-CMS — Implementation Plan & Task Checklist

**MERPATI** — *Media Editorial Ringkas, Praktis, Aman, Tetap Independen*

---

## Phase 1: Init "Hello World"
**Goal:** Establish the foundation, ensure the application runs, builds, and lints without errors.

- [ ] **1.1 Project Setup**
  - Initialize Next.js 15 App Router project (`npx create-next-app@latest`).
  - Configure TypeScript, ESLint, and Prettier.
  - Set up standard directory structure (`app/`, `components/`, `lib/`).
- [ ] **1.2 Clean Up & Hello World**
  - Remove default Next.js boilerplate.
  - Create a simple "Hello World" page at `/`.
  - Create a simple "Admin Hello World" page at `/admin`.
- [ ] **1.3 CI/CD Verification**
  - Run `pnpm lint` and resolve any warnings.
  - Run `pnpm build` to ensure a successful production build.
  - (Optional) Push to Vercel and verify the live deployment.

---

## Phase 2: Design & UI Components (Dummy Data)
**Goal:** Install view libraries, build all components, and make them interactive using getters/setters with dummy data. No real database yet.

### 2.1 CSS & UI Foundation
- [ ] Setup base CSS / Vanilla CSS variables (colors, typography from `design.md`).
- [ ] Create base UI primitives (Buttons, Inputs, Cards, Badges, Toast notifications).

### 2.2 Admin Layout & Navigation
- [ ] Build `Sidebar` component (navigation links).
- [ ] Build `TopBar` component (user profile menu placeholder).
- [ ] Create the main `(admin)/layout.tsx` wrapper.

### 2.3 Post Management UI
- [ ] Build `PostTable` component (list of posts with dummy data, pagination UI, status filters).
- [ ] Build `ClassicEditor` component (toolbar, contenteditable area, HTML toggle).
- [ ] Build `SEOPanel` and `PublishBox` sidebar components for the editor.

### 2.4 Media & Taxonomy UI
- [ ] Build `MediaLibrary` component (grid view of dummy images, upload button UI).
- [ ] Build `CategoryManager` component (split view: list + add new).
- [ ] Build `TagInput` component (chip-style input for the editor).

### 2.5 Settings & Profile UI
- [ ] Build `Settings` page tabs (General, SEO defaults, Telegram setup).
- [ ] Build `Profile` page UI.

### 2.6 Public Theme UI
- [ ] Create `ThemeEngine` scaffolding (mock class).
- [ ] Build default theme static layout (Header, Footer, Post List, Single Post) using dummy data.

---

## Phase 3: Backend & Integration
**Goal:** Install database/auth libraries, set up Neon DB, implement real API routes, and update getters/setters.

### 3.1 Database & ORM Setup
- [ ] Install Drizzle ORM and `@neondatabase/serverless`.
- [ ] Define full database schema in `drizzle/schema.ts`.
- [ ] Implement `init.sql` for WordPress-style automatic DB initialization (no CLI migrations).
- [ ] Set up Neon database connection helper (`lib/db/index.ts`).

### 3.2 Authentication Integration
- [ ] Install Auth.js (NextAuth v5).
- [ ] Configure Google OAuth provider.
- [ ] Implement user verification logic (first user = Super User, others = invite only).
- [ ] Protect `/(admin)` routes using middleware.

### 3.3 Core API Implementation (RPC Style)
- [ ] Implement the core `POST /api/rpc` endpoint handler.
- [ ] Implement action handlers for Posts (`posts.list`, `posts.get`, `posts.create`, etc.).
- [ ] Implement action handlers for Categories & Tags.
- [ ] Implement action handlers for Settings & Users.
- [ ] Implement Vercel Blob integration for Media uploads (`POST /api/media` - kept separate for multipart parsing).

### 3.4 UI Data Binding
- [ ] Replace Phase 2 dummy data getters/setters with `fetch` calls to the new real APIs.
- [ ] Wire up the Classic Editor to save to the database.
- [ ] Wire up the Media Library upload to Vercel Blob.

### 3.5 Final Polish & Verification
- [ ] Run comprehensive `pnpm lint`.
- [ ] Run `pnpm build` to verify type safety and server-side rendering.
- [ ] Test the full Initialization → Login → Create Post → Publish flow.
