import { headers } from "next/headers";

/**
 * Resolves the base URL of the site using multiple fallback strategies:
 * 1. NEXT_PUBLIC_SITE_URL — manually set env var (highest priority)
 * 2. VERCEL_PROJECT_PRODUCTION_URL — auto-provided by Vercel for production domain
 * 3. VERCEL_URL — auto-provided by Vercel per-deployment (preview URLs)
 * 4. Request headers (host) — works in server components & route handlers
 * 5. Localhost fallback
 *
 * No need to manually set NEXT_PUBLIC_SITE_URL on Vercel deployments.
 */
export async function getBaseUrl(): Promise<string> {
    // 1. Manual override
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // 2. Vercel production domain (e.g. "www.jogjabanget.id")
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    // 3. Vercel deployment URL (e.g. "merpati-abc123.vercel.app")
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 4. Detect from request headers (server components)
    try {
        const headersList = await headers();
        const host = headersList.get("x-forwarded-host") || headersList.get("host");
        if (host) {
            const protocol = host.includes("localhost") ? "http" : "https";
            return `${protocol}://${host}`;
        }
    } catch {
        // headers() may fail outside of a request context
    }

    // 5. Fallback
    return "http://localhost:3000";
}
