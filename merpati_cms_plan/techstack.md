# MERPATI-CMS — Technical Blueprint & Tech Stack

**MERPATI** — *Media Editorial Ringkas, Praktis, Aman, Tetap Independen*

> Phase 3 deliverable per Agent EDNA methodology.

---

## Stack Overview

| Layer | Technology | Justification |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Native Vercel deployment, serverless API routes, ISR caching, React for admin SPA |
| **Language** | TypeScript | Type safety, better DX, catches bugs early |
| **Database** | Neon PostgreSQL | Vercel-native, serverless-friendly, free tier (0.5GB), auto-suspend |
| **ORM** | Drizzle ORM | Lightweight, serverless-optimized (no cold-start penalty), SQL-like API, better than Prisma for edge |
| **DB Driver** | `@neondatabase/serverless` | HTTP-based driver, no persistent connections needed (critical for serverless) |
| **Auth** | Auth.js v5 (NextAuth) | Google OAuth provider built-in, JWT strategy, session management |
| **Image Storage** | `@vercel/blob` | Vercel-native, CDN-backed, simple put/del API, 500MB free |
| **Template Engine** | Handlebars | Logic-less, WordPress-familiar, fast precompiled render |
| **Editor** | Custom (contenteditable + execCommand) | No heavy deps, WP classic editor feel, full control |
| **CSS** | Vanilla CSS + Custom Properties | No build tool needed for themes, maximum flexibility |
| **Notifications** | Telegram Bot API (fetch) | Zero dependencies, HTTP POST only, no library needed |
| **Linting** | ESLint + Prettier | Standard Next.js setup |
| **Package Manager** | pnpm | Fast, efficient disk usage |

---

## Frontend Architecture

### Admin (Dynamic SPA)

The admin interface is a standard Next.js App Router application with client-side interactivity.

```
app/
  (auth)/
    login/page.tsx              # Login page (Google OAuth button)
    denied/page.tsx             # "Not invited" page

  (admin)/
    layout.tsx                  # Admin shell: sidebar + topbar + main area
    dashboard/page.tsx          # Dashboard with widgets
    posts/
      page.tsx                  # All Posts (table with filters)
      new/page.tsx              # Classic Editor (new post)
      [id]/edit/page.tsx        # Classic Editor (edit existing)
    pages/
      page.tsx                  # All Pages
      new/page.tsx              # New page
      [id]/edit/page.tsx        # Edit page
    media/page.tsx              # Media Library (grid + upload)
    categories/page.tsx         # Categories (CRUD split view)
    tags/page.tsx               # Tags (CRUD split view)
    themes/page.tsx             # Theme selection (super_user)
    users/page.tsx              # User management (super_user)
    settings/page.tsx           # Settings tabs (super_user)
    profile/page.tsx            # Own profile editor

  api/                          # API Routes (serverless functions)
    auth/[...nextauth]/route.ts # Auth.js handler
    rpc/route.ts                # Single Serverless API Endpoint (POST)
    media/route.ts              # GET (list), POST (upload) - kept separate for Blob uploads

components/
  admin/
    Sidebar.tsx                 # Navigation sidebar
    TopBar.tsx                  # Admin toolbar
    PostTable.tsx               # Posts list table
    ClassicEditor.tsx           # THE editor (toolbar + content area)
    EditorToolbar.tsx           # Formatting toolbar buttons
    MediaLibrary.tsx            # Grid gallery + upload
    MediaModal.tsx              # Media picker modal (for editor)
    CategoryManager.tsx         # Category CRUD
    TagInput.tsx                # Tag chips input with autocomplete
    PublishBox.tsx              # Publish sidebar meta box
    SEOPanel.tsx                # SEO fields + live preview
    FeaturedImage.tsx           # Featured image selector
    Toast.tsx                   # Toast notification system
    DataTable.tsx               # Reusable table component
    EmptyState.tsx              # Reusable empty state
    ConfirmDialog.tsx           # Confirmation modal
```

### Public Pages (Static/Cached via Theme Engine)

Public pages are rendered server-side using the Handlebars theme engine and cached via ISR.

```
app/
  (public)/
    layout.tsx                  # Minimal layout — delegates to theme engine
    page.tsx                    # Homepage (ISR, revalidate: 60)
    [slug]/page.tsx             # Single post (ISR, revalidate: 60)
    page/[slug]/page.tsx        # Static page
    category/[slug]/page.tsx    # Category archive
    tag/[slug]/page.tsx         # Tag archive

  feed.xml/route.ts             # RSS 2.0 feed
  feed/category/[slug]/route.ts # RSS per category
  sitemap.xml/route.ts          # Main sitemap
  sitemap-posts.xml/route.ts    # Posts sitemap
  sitemap-pages.xml/route.ts    # Pages sitemap
  news-sitemap.xml/route.ts     # Google News sitemap
  robots.txt/route.ts           # Dynamic robots.txt
```

### Theme Engine Integration

```
lib/
  theme/
    ThemeEngine.ts              # Core engine class
    ThemeConfig.ts              # Type definitions
    helpers.ts                  # Handlebars custom helpers (formatDate, truncate, etc.)
    resolver.ts                 # Template resolution (child → parent fallback)

themes/                         # Theme folders (at project root)
  default/
    theme.json
    templates/
      layout.hbs
      index.hbs
      single.hbs
      page.hbs
      archive.hbs
      partials/
        header.hbs
        footer.hbs
        post-card.hbs
        pagination.hbs
        share-buttons.hbs       # Share UI partial
        seo-meta.hbs            # Meta tags partial
        structured-data.hbs     # JSON-LD partial
    assets/
      style.css
```

---

## Backend & Database

### Database Schema (Drizzle ORM)

```typescript
// db/schema.ts

import { pgTable, uuid, varchar, text, timestamp, boolean, integer, bigint, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'trash']);
export const pageStatusEnum = pgEnum('page_status', ['draft', 'published']);
export const userRoleEnum = pgEnum('user_role', ['super_user', 'user']);

// Users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  googleId: varchar('google_id', { length: 255 }).notNull().unique(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  bio: text('bio'),
  role: userRoleEnum('role').notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  invitedBy: uuid('invited_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Invitations
export const invitations = pgTable('invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('user'),
  invitedBy: uuid('invited_by').references(() => users.id).notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Posts
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content'),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 500 }),
  status: postStatusEnum('status').notNull().default('draft'),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  publishedBy: uuid('published_by').references(() => users.id),
  publishedAt: timestamp('published_at'),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  isIndexable: boolean('is_indexable').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories
export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  parentId: uuid('parent_id').references(() => categories.id),
});

// Tags
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

// Post <-> Category (Many-to-Many)
export const postCategories = pgTable('post_categories', {
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
});

// Post <-> Tag (Many-to-Many)
export const postTags = pgTable('post_tags', {
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  tagId: uuid('tag_id').references(() => tags.id, { onDelete: 'cascade' }).notNull(),
});

// Pages
export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content'),
  status: pageStatusEnum('status').notNull().default('draft'),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  publishedBy: uuid('published_by').references(() => users.id),
  parentId: uuid('parent_id').references(() => pages.id),
  sortOrder: integer('sort_order').notNull().default(0),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 500 }),
  canonicalUrl: varchar('canonical_url', { length: 500 }),
  isIndexable: boolean('is_indexable').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media
export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  blobUrl: varchar('blob_url', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 50 }).notNull(),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  uploadedBy: uuid('uploaded_by').references(() => users.id).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// Settings (key-value)
export const settings = pgTable('settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
});
```

### Database Connection

```typescript
// db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

---

## Single API Endpoint (RPC Style)

To optimize for serverless execution and simplify the architecture, the CMS utilizes a **Single API Endpoint** pattern (RPC-style) for all data operations, reducing the number of serverless functions deployed.

### Core Endpoint

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/rpc` | ✅ | Handles all CRUD operations via an `action` payload |
| GET/POST | `/api/auth/[...nextauth]` | — | Auth.js handler (Google OAuth flow) |
| POST | `/api/media` | ✅ | Vercel Blob direct upload handler (kept separate for multipart/form-data) |

### RPC Payload Structure

All requests to `/api/rpc` must be `POST` requests with a JSON body following this envelope:

```json
{
  "action": "posts.list",
  "payload": {
    "status": "published",
    "page": 1
  }
}
```

### Available Actions

| Action | Auth Role | Payload Example | Returns |
|---|---|---|---|
| **Posts** |
| `posts.list` | any | `{ "status": "draft", "page": 1 }` | Paginated post list |
| `posts.get` | any | `{ "id": "uuid" }` | Single post object |
| `posts.create` | any | `{ "title": "New", "content": "..." }` | New post object |
| `posts.update` | own/super | `{ "id": "uuid", "title": "Updated" }`| Updated post |
| `posts.delete` | own/super | `{ "id": "uuid" }` | Success boolean |
| `posts.publish`| any | `{ "id": "uuid" }` | Success boolean |
| **Pages** |
| `pages.list` | any | `{}` | List pages |
| `pages.get` | any | `{ "id": "uuid" }` | Single page |
| `pages.create` | super_user | `{ "title": "..." }` | New page |
| `pages.update` | super_user | `{ "id": "uuid", "title": "..." }` | Updated page |
| `pages.delete` | super_user | `{ "id": "uuid" }` | Success boolean |
| **Categories/Tags** |
| `categories.list` | any | `{}` | List categories |
| `categories.create` | super_user | `{ "name": "..." }` | New category |
| `categories.update` | super_user | `{ "id": "uuid", "name": "..." }`| Updated category |
| `categories.delete` | super_user | `{ "id": "uuid" }` | Success boolean |
| `tags.list` | any | `{}` | List tags |
| `tags.create` | super_user | `{ "name": "..." }` | New tag |
| `tags.update` | super_user | `{ "id": "uuid", "name": "..." }` | Updated tag |
| `tags.delete` | super_user | `{ "id": "uuid" }` | Success boolean |
| **Users** |
| `users.list` | super_user | `{}` | List users |
| `users.update` | super_user | `{ "id": "uuid", "role": "..." }` | Updated user |
| `users.invite` | super_user | `{ "email": "..." }` | Success boolean |
| `users.me` | any | `{}` | Current user profile |
| `users.updateMe`| any | `{ "bio": "..." }` | Updated profile |
| **Settings/Themes** |
| `settings.get` | any | `{}` | Key-value settings |
| `settings.update` | super_user | `{ "settings": [...] }` | Success boolean |
| `themes.list` | super_user | `{}` | List themes |
| `themes.activate` | super_user | `{ "theme": "..." }` | Success boolean |
| **Media** (Read/Delete only, upload is via `/api/media`) |
| `media.list` | any | `{ "page": 1 }` | Paginated media list |
| `media.get` | any | `{ "id": "uuid" }` | Media details |
| `media.delete` | own/super | `{ "id": "uuid" }` | Success boolean |

---

## Security Architecture

### Authentication Flow

```
┌─────────┐    ┌──────────────┐    ┌──────────┐    ┌──────────┐
│ Browser  │───>│ /api/auth/   │───>│ Google   │───>│ Callback │
│          │    │ signin/google│    │ OAuth    │    │ Handler  │
└─────────┘    └──────────────┘    └──────────┘    └────┬─────┘
                                                        │
                                                        ▼
                                               ┌──────────────┐
                                               │ Check user:  │
                                               │ 1. Exists?   │
                                               │ 2. Invited?  │
                                               │ 3. First?    │
                                               └──────┬───────┘
                                                      │
                                                      ▼
                                               ┌──────────────┐
                                               │ JWT Cookie   │
                                               │ httpOnly     │
                                               │ secure       │
                                               │ 7-day expiry │
                                               └──────────────┘
```

### Auth.js Configuration

```typescript
// auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // 1. Check if user exists by google_id
      // 2. Check invitations by email
      // 3. Check if first user (auto super_user)
      // 4. Reject if none match
    },
    async jwt({ token, user }) {
      // Embed user.id and user.role in JWT
    },
    async session({ session, token }) {
      // Expose id and role in session
    },
  },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 }, // 7 days
});
```

### Authorization Middleware

```typescript
// middleware.ts
import { auth } from './auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes: /, /[slug], /category/*, /tag/*, /feed.xml, /sitemap*, /robots.txt
  // Auth routes: /login, /denied
  // Admin routes: everything under /(admin)/* → require auth
  // Super user routes: /users, /settings, /themes, /categories, /tags, /pages → require super_user role
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Security Measures

| Measure | Implementation |
|---|---|
| **XSS Prevention** | DOMPurify sanitization on content save; React auto-escapes output |
| **CSRF Protection** | Auth.js built-in CSRF tokens; Vercel origin validation |
| **SQL Injection** | Drizzle ORM parameterized queries (never raw SQL) |
| **Rate Limiting** | Vercel middleware: 5 login attempts / 15 min; 100 API calls / min |
| **Input Validation** | Zod schemas for all API request bodies |
| **File Upload** | Max 4.5MB; allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml` |
| **Secrets** | All secrets in environment variables; never in code |

---

## Testing Strategy

### Unit Tests

| Framework | Target | Coverage Goal |
|---|---|---|
| **Vitest** | Utility functions, helpers, Handlebars helpers, slug generation | 80%+ |
| **Vitest** | API route handlers (mocked DB) | 70%+ |

### Integration Tests

| Framework | Target |
|---|---|
| **Vitest + test DB** | Database schema migrations |
| **Vitest + test DB** | API endpoints with real DB queries |
| **Vitest** | Auth flow (mocked Google OAuth) |

### E2E Tests

| Framework | Target |
|---|---|
| **Playwright** | Login flow (Google OAuth mock) |
| **Playwright** | Full post lifecycle: create → edit → publish → view public |
| **Playwright** | Media upload flow |
| **Playwright** | User invitation flow |
| **Playwright** | Settings update |

### Performance Tests

| Tool | Target | Threshold |
|---|---|---|
| **Lighthouse CI** | Public pages | Score 90+ (Performance, Accessibility, SEO) |
| **Vercel Analytics** | Core Web Vitals | LCP < 2.5s, FID < 100ms, CLS < 0.1 |

---

## Deployment & CI/CD

### Hosting

| Service | Usage | Tier |
|---|---|---|
| **Vercel** | Next.js hosting, serverless functions, edge middleware | Free (Hobby) |
| **Neon** | PostgreSQL database | Free (0.5GB, auto-suspend) |
| **Vercel Blob** | Image/media storage | Free (500MB) |

### Environment Variables

```bash
# .env.local
DATABASE_URL=postgres://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=random-32-char-secret

SITE_URL=https://your-domain.vercel.app

# Telegram credentials are stored in DB settings table (configured via Admin → Settings → Telegram)
# Keys: telegram_bot_token, telegram_chat_id
```

### CI/CD Pipeline

```
Push to main
  │
  ├── Vercel auto-deploy
  │   ├── Install (pnpm install)
  │   ├── Lint (eslint)
  │   ├── Type check (tsc --noEmit)
  │   ├── Unit tests (vitest run)
  │   ├── Build (next build)
  │   └── Deploy to production
  │
  └── PR branches
      ├── Same lint/typecheck/test
      └── Deploy to preview URL
```

### Database Initialization (No CLI Migrations)

To ensure exactly a WordPress-like experience for non-technical users, **CLI-based database migrations are not used in production deployment.** Instead, the application features an automatic self-initialization mechanism:

1. **Raw SQL Execution**: The schema (`CREATE TABLE`, `CREATE ENUM`, etc.) is stored in a raw SQL string or file (e.g., `/lib/db/init.sql.ts`).
2. **Auto-Detection**: A setup routine or middleware checks if the database is populated.
3. **Execution**: If the database connection succeeds but the DB is empty, the application automatically executes the raw SQL using the Neon HTTP driver to initialize the schema and seed initial data.
4. **ORM Role**: Drizzle ORM is utilized strictly for querying and typing *after* the raw initialization is complete.

---

## Project Directory Structure

```
merpati-cms/
├── app/
│   ├── (auth)/                 # Auth pages (login, denied)
│   ├── (admin)/                # Admin SPA pages
│   ├── (public)/               # Public cached pages
│   ├── api/                    # API routes
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── admin/                  # Admin-specific components
│   └── ui/                     # Shared UI primitives
├── lib/
│   ├── theme/                  # ThemeEngine, resolver, helpers
│   ├── db/                     # Drizzle config, schema, queries
│   ├── auth.ts                 # Auth.js config
│   ├── telegram.ts             # Telegram notification helper
│   ├── seo.ts                  # Meta tag generation helpers
│   ├── sanitize.ts             # DOMPurify wrapper
│   └── utils.ts                # Slug generation, date formatting, etc.
├── themes/
│   └── default/                # Built-in default theme
├── public/                     # Static assets (favicons, etc.)
├── drizzle/                    # Generated migrations
├── drizzle.config.ts           # Drizzle ORM config
├── middleware.ts               # Auth + rate limiting middleware
├── auth.ts                     # Auth.js export
├── next.config.ts              # Next.js config
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
├── .env.local                  # Secrets (gitignored)
├── .env.example                # Template for env vars
└── README.md
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0",
    "@neondatabase/serverless": "^0.10.0",
    "drizzle-orm": "^0.36.0",
    "@vercel/blob": "^0.27.0",
    "handlebars": "^4.7.8",
    "dompurify": "^3.1.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "drizzle-kit": "^0.28.0",
    "vitest": "^2.1.0",
    "@playwright/test": "^1.48.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.3.0"
  }
}
```

> [!NOTE]
> Total production dependencies: **9 packages**. Kept intentionally minimal to avoid cold-start bloat in serverless functions.

---

## Vercel Free Tier Constraints & Mitigations

| Constraint | Limit | Mitigation |
|---|---|---|
| Serverless function execution | 10s timeout | Efficient queries, no heavy computation |
| Serverless function size | 50MB | Minimal deps (9 packages) |
| Bandwidth | 100GB/month | ISR caching for public pages |
| Builds | 6000 min/month | Only deploy on main push |
| Vercel Blob | 500MB | Compress images before upload, warn on large files |
| Neon DB | 0.5GB storage | Monitor usage, text content is lightweight |
| Neon DB | Auto-suspend after 5 min idle | `@neondatabase/serverless` handles reconnection |
| API routes | No persistent connections | HTTP-based Neon driver (not WebSocket) |
