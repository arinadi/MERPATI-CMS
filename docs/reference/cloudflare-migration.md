# Cloudflare Migration Guide 🚀

This guide outlines the steps required to migrate MERPATI CMS from Vercel to **Cloudflare Free Tier**, ensuring unlimited bandwidth and edge-speed performance.

## 1. Prerequisites
- A Cloudflare Account.
- Domain managed by or pointed to Cloudflare.
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-setup/) installed.

---

## 2. Component Mapping
| Service | Vercel (Current) | Cloudflare (Target) |
| :--- | :--- | :--- |
| **Hosting** | Vercel Functions | **Cloudflare Pages** |
| **Storage** | Vercel Blob | **Cloudflare R2** |
| **Compute** | Node.js Serverless | **Cloudflare Workers (Edge)** |
| **Database** | Neon PostgreSQL | **Neon (via Hyperdrive)** or **Cloudflare D1** |

---

## 3. Step-by-Step Migration

### Step 1: Install Cloudflare Adapter
MERPATI uses Next.js 15. You need the specific adapter for Cloudflare Pages:
```bash
npm install --save-dev @cloudflare/next-on-pages
```

### Step 2: Media Storage (Vercel Blob → R2)
1. Create an R2 Bucket in Cloudflare Dashboard.
2. In `lib/actions/media.ts`, replace `@vercel/blob` with the AWS S3 SDK (compatible with R2).
3. Set environment variables: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME`.

### Step 3: Database Connection
Cloudflare Workers run on the Edge. To maintain high performance with Neon:
1. Enable **Cloudflare Hyperdrive** in your Cloudflare dashboard.
2. Provide your Neon connection string to Hyperdrive.
3. Use the Hyperdrive connection string in your production `.env`.

### Step 4: Auth Configuration
`Auth.js` (NextAuth) is edge-compatible. Ensure `AUTH_TRUST_HOST=true` is set in Cloudflare Pages environment variables.

### Step 5: Build & Deploy
Instead of standard `next build`, use:
```bash
npx @cloudflare/next-on-pages
```
Then deploy the `.vercel/output/static` directory to Cloudflare Pages.

---

## 4. Why Migrate to Cloudflare?
1. **Unlimited Bandwidth:** Unlike Vercel's 100GB limit, Cloudflare Pages offers unlimited bandwidth on the free tier.
2. **No Egress Fees:** Serving images from R2 is completely free of data transfer charges.
3. **Edge SEO:** With servers in 300+ cities (including Jakarta), your TTFB (Time to First Byte) will be significantly lower, boosting Google Search rankings in Indonesia.
4. **WAF Security:** Free enterprise-grade protection against DDoS and bot scraping.

---

## 5. Technical Limitations to Watch
- **Edge Runtime:** Some Node.js native modules (e.g., `crypto` from Node vs Web Crypto) might need minor code adjustments.
- **Bundle Size:** Cloudflare Workers (Free) has a 1MB compressed script limit. Keep dependencies lean.

---

*Last Updated: April 2026*
