import { NextResponse } from "next/server";
import { checkInitialized } from "@/lib/actions/setup";
import { cookies } from "next/headers";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Route Handler that checks if DB is initialized.
 */
export async function GET(request: Request) {
    const initialized = await checkInitialized();

    if (initialized) {
        const cookieStore = await cookies();
        cookieStore.set("merpati_initialized", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 365 * 10,
        });
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.redirect(new URL("/setup", request.url));
}
