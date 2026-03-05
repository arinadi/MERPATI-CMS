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

    // Helper: split SQL into individual statements (respects $$ blocks)
    async function execSqlFile(sqlContent: string) {
        const statements: string[] = [];
        let current = "";
        let inDollarBlock = false;

        for (const line of sqlContent.split("\n")) {
            const trimmed = line.trim();
            if (!inDollarBlock && trimmed.startsWith("DO $$")) inDollarBlock = true;
            current += line + "\n";
            if (inDollarBlock && trimmed.endsWith("$$;")) {
                inDollarBlock = false;
                statements.push(current.trim());
                current = "";
            } else if (!inDollarBlock && trimmed.endsWith(";")) {
                statements.push(current.trim());
                current = "";
            }
        }
        if (current.trim()) statements.push(current.trim());

        for (const stmt of statements) {
            const clean = stmt.replace(/^\s*--.*$/gm, "").trim();
            if (clean) await sql.query(stmt);
        }
    }

    // 1. Execute init.sql to create all tables
    const initSqlPath = path.join(process.cwd(), "db", "init.sql");
    const initSqlContent = fs.readFileSync(initSqlPath, "utf-8");
    await execSqlFile(initSqlContent);

    // 2. Execute seed.sql with placeholders replaced
    const seedSqlPath = path.join(process.cwd(), "db", "seed.sql");
    let seedSqlContent = fs.readFileSync(seedSqlPath, "utf-8");

    // Replace placeholders
    // Super User ID will be set after first login, use a temporary placeholder
    seedSqlContent = seedSqlContent.replace(/__SITE_TITLE__/g, siteTitle.replace(/'/g, "''"));
    seedSqlContent = seedSqlContent.replace(/__SITE_TAGLINE__/g, siteTagline.replace(/'/g, "''"));
    seedSqlContent = seedSqlContent.replace(/__SUPER_USER_ID__/g, "NULL");

    await execSqlFile(seedSqlContent);

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

