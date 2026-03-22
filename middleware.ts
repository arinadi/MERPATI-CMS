import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Fast reject for common bot paths (WordPress, PHP, .env, etc.)
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

    // ─── PUBLIC ROUTES: Let them pass without ANY auth/cookie reads ────
    // This is critical for Next.js Full Route Cache to work!
    if (
        !pathname.startsWith("/admin") &&
        pathname !== "/login" &&
        pathname !== "/setup"
    ) {
        return NextResponse.next();
    }

    // /setup page — always let through, no auth/cookie check needed.
    // The setup page itself handles "already initialized" via checkInitialized().
    // This prevents redirect loops when DB is deleted but cookie still exists.
    if (pathname === "/setup") {
        return NextResponse.next();
    }

    // ─── From here on, we need auth. Dynamically import to avoid
    //     loading auth module for public routes. ───────────────────────
    const { auth } = await import("@/auth");
    const session = await auth();
    const isAuthenticated = !!session;

    // If not initialized, redirect /admin to check-init API
    const isInitialized = req.cookies.get("merpati_initialized")?.value === "true";
    if (!isInitialized && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/api/check-init", req.url));
    }

    // Protect /admin routes — require authentication
    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Restrict sensitive menus to super_user
        if (
            pathname.startsWith("/admin/settings") ||
            pathname.startsWith("/admin/users") ||
            pathname.startsWith("/admin/menus") ||
            pathname.startsWith("/admin/cache")
        ) {
            if ((session?.user as { role?: string })?.role !== "super_user") {
                return NextResponse.redirect(new URL("/admin/posts", req.url));
            }
        }
    }

    // If authenticated and on /login, redirect to /admin
    if (pathname === "/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
}

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

