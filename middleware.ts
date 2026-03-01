import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');

    // Protect admin routes
    if (isOnAdmin && !isLoggedIn) {
        if (req.nextUrl.pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    }

    // Redirect from login to admin if logged in
    if (req.nextUrl.pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
