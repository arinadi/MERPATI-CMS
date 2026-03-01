"use server";

import { db } from "@/db";
import { users, settings } from "@/db/schema";


import { migrate } from "drizzle-orm/neon-http/migrator";

export async function installCms(formData: FormData) {
    try {
        const firstUser = await db.query.users.findFirst();
        if (firstUser) {
            return { error: "MERPATI-CMS is already installed." };
        }
    } catch {
        console.log("Empty database detected, running migrations...");
        try {
            await migrate(db, { migrationsFolder: "drizzle" });
        } catch (migErr) {
            console.error("Migration Error:", migErr);
            return { error: "Failed to create database tables: " + (migErr instanceof Error ? migErr.message : "Unknown error") };
        }
    }
    const title = formData.get("site_title") as string;
    const tagline = formData.get("site_tagline") as string;
    const adminEmail = formData.get("admin_email") as string;

    if (!title || !adminEmail) {
        return { error: "Site Title and Admin Email are required." };
    }

    try {
        // Save Settings
        await db.insert(settings).values([
            { key: "site_title", value: title },
            { key: "site_tagline", value: tagline },
        ]);

        // Pre-create the super user
        await db.insert(users).values({
            email: adminEmail.toLowerCase(),
            name: "Super Admin",
            role: "super_user",
        });

        return { success: true };
    } catch (err) {
        console.error("Install Error:", err);
        return { error: "Internal server error during installation." };
    }
}
