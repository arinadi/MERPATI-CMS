import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Allow static files, api/auth, and _next
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    const isAuthenticated = !!req.auth;

    // Check initialization status via cookie (set after setup completes)
    const isInitialized = req.cookies.get("merpati_initialized")?.value === "true";

    // If not initialized, redirect everything except /setup to /setup
    if (!isInitialized) {
        if (pathname === "/setup") {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/setup", req.url));
    }

    // If initialized, /setup should redirect to home
    if (pathname === "/setup") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect /admin routes
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
