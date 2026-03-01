"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function saveSettings(data: Record<string, string>) {
    const session = await auth();
    // Only super_user can modify settings
    if (session?.user?.role !== "super_user") return { error: "Unauthorized" };

    try {
        const promises = Object.entries(data).map(([key, value]) => {
            return db.insert(settings)
                .values({ key, value })
                .onConflictDoUpdate({
                    target: settings.key,
                    set: { value }
                });
        });

        await Promise.all(promises);

        revalidatePath("/settings");
        revalidatePath("/", "layout"); // Revalidate entire app to reflect new settings

        return { success: true };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to save settings" };
    }
}
