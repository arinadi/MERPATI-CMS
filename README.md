# MERPATI CMS

> **Media Editorial Ringkas, Praktis, Aman, Tetap Independen**
>
> *Press freedom starts with infrastructure independence.*

A modern digital publishing platform — a lightweight, fast, and completely free WordPress alternative. Built on a serverless architecture, fully deployed on **Vercel Free Tier**.

---

## ✨ Core Features

- 📝 **Classic Editor** — Familiar WYSIWYG editor (bold, italic, headings, lists, media insert) with HTML toggle and autosave.
- 📷 **Media Library** — Direct upload to Vercel Blob or input via public URL, with grid view and copy URL.
- 🎨 **Modular Theme System** — React Server Components in `/themes`, pure Tailwind CSS v4, maximum performance.
- 👤 **User Management (Invite-Only)** — Exclusive Google OAuth 2.0. First user automatically becomes Super User.
- 🔔 **Telegram Notifications** — Automatic push notifications when a new post is published or a new user joins.
- 🔗 **SEO Engine** — Open Graph, Twitter Cards, JSON-LD, Sitemap, News Sitemap, and RSS Feed out of the box.
- 🧭 **Navigation Menus** — Drag-and-drop menu management with support for custom links, posts, pages, and categories.

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Database | Neon DB (Serverless Postgres) |
| ORM | Drizzle ORM |
| Auth | Auth.js v5 (Google OAuth, JWT) |
| Media | Vercel Blob |
| Admin UI | Tailwind CSS v4 + shadcn/ui |
| Public UI | Pure Tailwind CSS v4 (React Server Components) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- [Neon](https://neon.tech) account (Serverless Postgres)
- [Google Cloud Console](https://console.cloud.google.com) account (OAuth credentials)

### Setup

```bash
# Clone
git clone https://github.com/arinadi/MERPATI-CMS.git
cd MERPATI-CMS

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

Open `http://localhost:3000` — the system will automatically redirect to the **Setup** page for first-time initialization.

### Initialization Flow

1. **Setup Wizard** — Enter Site Title and Tagline → database tables and seed data are created automatically.
2. **Super User Claim** — First Google OAuth login automatically becomes the Super User.
3. **Start Writing** — Access `/admin` to start managing content.

## 📁 Project Structure

```
├── app/
│   ├── (public)/[...slug]/   # Catch-all public route
│   ├── admin/                 # Admin dashboard
│   ├── api/auth/              # Auth.js route handler
│   ├── login/                 # Login page
│   └── setup/                 # Setup wizard
├── db/
│   ├── index.ts               # Drizzle + Neon connection
│   ├── schema.ts              # Database schema (all tables)
│   ├── init.sql               # DDL for runtime bootstrap
│   └── seed.sql               # Default seed data
├── lib/                       # Utilities & server actions
├── themes/                    # Modular theme directory
│   └── default/               # Default theme
└── auth.ts                    # Auth.js v5 configuration
```

## 📄 License

MIT
