import { NextRequest, NextResponse } from "next/server";
import { runCronBackup } from "@/lib/actions/backup";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    // Verify Vercel Cron Header
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // Fallback for development if CRON_SECRET is not set, 
        // but in production Vercel will provide this.
        // Also check for X-Vercel-Cron header
        const isVercelCron = request.headers.get("x-vercel-cron") === "1";
        if (!isVercelCron && process.env.NODE_ENV === "production") {
            return new Response("Unauthorized", { status: 401 });
        }
    }

    try {
        const result = await runCronBackup();
        if (result.success) {
            return NextResponse.json({ success: true, message: "Backup completed" });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
