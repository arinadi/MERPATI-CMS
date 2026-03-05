# 🛠️ Detailed Prerequisites for MERPATI CMS

To ensure a smooth setup and deployment of MERPATI CMS, please ensure you have the following accounts and tools ready.

---

## 1. Runtime & Package Manager
MERPATI is built with the latest Next.js features and requires a modern Node.js environment.

- **Node.js (18.x or 20.x)**: The recommended runtime for Next.js 15.
  - [Download Node.js](https://nodejs.org/)
- **pnpm**: A fast, disk space efficient package manager.
  - [Install pnpm](https://pnpm.io/installation)

---

## 2. Database (Serverless Postgres)
We use **Neon** for its native serverless scaling and generous free tier.

- **Neon.tech Account**: Create a project and get your `DATABASE_URL`.
  - [Neon Documentation](https://neon.tech/docs/introduction)
  - [Get Started with Neon](https://console.neon.tech/register)

---

## 3. Authentication (Google OAuth 2.0)
MERPATI uses an invite-only authentication system powered by Google.

- **Google Cloud Console**: You need to create a project and configure OAuth 2.0 credentials.
  - **Authorized JavaScript Origins**: `http://localhost:3000` (for local dev) and your production URL.
  - **Authorized Redirect URIs**: `http://localhost:3000/api/auth/callback/google` and `https://your-domain.com/api/auth/callback/google`.
  - [OAuth 2.0 Setup Guide](https://support.google.com/cloud/answer/6158849)
  - [Google Cloud Console](https://console.cloud.google.com/)

---

## 4. Media Storage (Vercel Blob)
*Optional for local development, recommended for production.*

- **Vercel Blob**: High-performance object storage for images and media.
  - If deploying to Vercel, you can easily add this via the "Storage" tab in your project dashboard.
  - [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)

---

## 5. Deployment (Vercel)
MERPATI is optimized for the Vercel Edge Network.

- **Vercel Account**: Deploy your repository with a single click.
  - [Vercel Documentation](https://vercel.com/docs)

---

*Once you have these ready, follow the [README.md](./README.md) to start the setup wizard.*
