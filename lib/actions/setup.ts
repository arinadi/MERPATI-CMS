"use server";

import { neon } from "@neondatabase/serverless";
import { db } from "@/db";
import { options } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
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

    // Helper: split SQL into individual statements
    // Respects $$ blocks AND single-quoted strings (multi-line content)
    // Skips SQL comments (--) when tracking quote state
    async function execSqlFile(sqlContent: string) {
        const statements: string[] = [];
        let current = "";
        let inDollarBlock = false;
        let inString = false;

        for (const line of sqlContent.split("\n")) {
            const trimmed = line.trim();
            if (!inDollarBlock && !inString && trimmed.startsWith("DO $$")) inDollarBlock = true;
            current += line + "\n";

            // Track whether we're inside a single-quoted SQL string
            // Skip comment lines — they can contain apostrophes that break tracking
            if (!inDollarBlock && !trimmed.startsWith("--")) {
                const withoutEscaped = line.replace(/''/g, "");
                const quoteCount = (withoutEscaped.match(/'/g) || []).length;
                if (quoteCount % 2 !== 0) {
                    inString = !inString;
                }
            }

            if (inDollarBlock && trimmed.endsWith("$$;")) {
                inDollarBlock = false;
                statements.push(current.trim());
                current = "";
            } else if (!inDollarBlock && !inString && trimmed.endsWith(";")) {
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
    seedSqlContent = seedSqlContent.replace(/__SITE_TITLE__/g, siteTitle.replace(/'/g, "''"));
    seedSqlContent = seedSqlContent.replace(/__SITE_TAGLINE__/g, siteTagline.replace(/'/g, "''"));
    // Use subquery to get the super user's ID (first user with role 'super_user')
    seedSqlContent = seedSqlContent.replace(/__SUPER_USER_ID__/g, "(SELECT id FROM users WHERE role = 'super_user' LIMIT 1)");

    await execSqlFile(seedSqlContent);

    // Invalidate all cached data so stale null values are cleared
    revalidatePath("/", "layout");

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
