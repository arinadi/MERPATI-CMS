import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Fast reject for common bot paths (WordPress, PHP, .env, etc.)
    // Ini menghemat resource Vercel karena merespon error langsung dari Edge Server
    if (
        pathname.startsWith("/wp-admin") ||
        pathname.startsWith("/wp-login") ||
        pathname.startsWith("/wp-includes") ||
        pathname.startsWith("/.git") ||
        pathname.startsWith("/.env") ||
        pathname.endsWith(".php")
    ) {
        return new NextResponse("Not Found", { status: 404 });
    }

    // Allow static files, api routes, and _next
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/") ||
        pathname.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    const isAuthenticated = !!req.auth;

    // Check initialization status via cookie (set after setup completes)
    const isInitialized = req.cookies.get("merpati_initialized")?.value === "true";

    // /setup page is always accessible — the page itself checks DB and redirects if needed
    if (pathname === "/setup") {
        // If cookie says initialized, redirect away from setup
        if (isInitialized) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // If not initialized (no cookie), redirect /admin to check-init API
    // which will verify DB state, set cookie if needed, and redirect appropriately
    if (!isInitialized && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/api/check-init", req.url));
    }

    // Protect /admin routes — require authentication
    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // If authenticated and on /login, redirect to /admin
    if (pathname === "/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public files (images, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
