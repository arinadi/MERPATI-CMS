"use server";

import { neon } from "@neondatabase/serverless";
import { db } from "@/db";
import { options } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function bootstrapDatabase(formData: FormData) {
    const siteTitle = formData.get("siteTitle") as string;
    const siteTagline = formData.get("siteTagline") as string;

    if (!siteTitle || !siteTagline) {
        throw new Error("Site Title and Tagline are required.");
    }

    // Check if already initialized
    try {
        const existing = await db
            .select()
            .from(options)
            .where(eq(options.key, "is_initialized"));
        if (existing.length > 0 && existing[0].value === "true") {
            redirect("/login");
        }
    } catch {
        // Table doesn't exist yet, proceed with initialization
    }

    const sql = neon(process.env.DATABASE_URL!);

    // 1. Execute init.sql to create all tables
    const initSqlPath = path.join(process.cwd(), "db", "init.sql");
    const initSqlContent = fs.readFileSync(initSqlPath, "utf-8");
    await sql.query(initSqlContent);

    // 2. Execute seed.sql with placeholders replaced
    const seedSqlPath = path.join(process.cwd(), "db", "seed.sql");
    let seedSqlContent = fs.readFileSync(seedSqlPath, "utf-8");

    // Replace placeholders
    // Super User ID will be set after first login, use a temporary placeholder
    seedSqlContent = seedSqlContent.replace(/__SITE_TITLE__/g, siteTitle.replace(/'/g, "''"));
    seedSqlContent = seedSqlContent.replace(/__SITE_TAGLINE__/g, siteTagline.replace(/'/g, "''"));
    seedSqlContent = seedSqlContent.replace(/__SUPER_USER_ID__/g, "pending-super-user");

    await sql.query(seedSqlContent);

    // Set initialization cookie for middleware
    const cookieStore = await cookies();
    cookieStore.set("merpati_initialized", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    });

    redirect("/login");
}

export async function checkInitialized(): Promise<boolean> {
    try {
        const result = await db
            .select()
            .from(options)
            .where(eq(options.key, "is_initialized"));
        return result.length > 0 && result[0].value === "true";
    } catch {
        return false;
    }
}

