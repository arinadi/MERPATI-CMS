# Module 8: SEO & Share Engine

## Requirements
Ensure the public frontend is highly optimized for search engines and social sharing out-of-the-box. Generate valid XML sitemaps, JSON-LD schema, and RSS feeds.

## UI Structure
*   *No Admin UI required for this module specifically, relies on existing post data.*

## Data & API
*   **Next.js Metadata:** Implement `generateMetadata` in `[...slug]/page.tsx` and `layout.tsx`.
    *   Map `title` to Open Graph Title & Twitter Title.
    *   Map `excerpt` to Meta Description & OG/Twitter Description.
    *   Map first image in `content` (or a dedicated featured image field if added) to `og:image` and `twitter:image`.
*   **Sitemaps:**
    *   `app/sitemap.ts`: Dynamically fetches all published Posts, Pages, Categories, and Tags to generate `/sitemap.xml`.
    *   `app/server/rss/route.ts`: API route that returns an XML RSS feed of the latest posts.

## Technical Implementation
*   **JSON-LD:** Inject a `<script type="application/ld+json">` tag in the `<head>` of single post pages outputting a valid Schema.org `NewsArticle` or `Article` object.
*   **RSS Generation:** Utilize a lightweight library like `feed` or manually map string templates via Next.js Route Handlers (`NextResponse` with text/xml content-type).
*   **News Sitemap:** Similar to standard sitemap but utilizing the Google News sitemap spec if specific news-related fields are necessary.
