"use server";

import { db } from "@/db";
import { options } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Get a single option value by key.
 */
export async function getOption(key: string): Promise<string | null> {
    try {
        const result = await db
            .select({ value: options.value })
            .from(options)
            .where(eq(options.key, key))
            .limit(1);

        return result[0]?.value ?? null;
    } catch (error: unknown) {
        const err = error as Error & { code?: string; cause?: { message?: string } };
        const errorText = err?.message + " " + (err?.cause?.message || "");
        if (err?.code === '42P01' || errorText.includes('relation "options" does not exist')) {
            return null;
        }
        console.warn(`Warning getting option ${key}:`, errorText);
        return null;
    }
}

/**
 * Get multiple options by their keys.
 */
export async function getOptions(keys: string[]): Promise<Record<string, string>> {
    try {
        const results = await db
            .select({ key: options.key, value: options.value })
            .from(options)
            .where(inArray(options.key, keys));

        return results.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error: unknown) {
        const err = error as Error & { code?: string; cause?: { message?: string } };
        const errorText = err?.message + " " + (err?.cause?.message || "");
        if (err?.code === '42P01' || errorText.includes('relation "options" does not exist')) {
            return {};
        }
        console.warn("Warning getting multiple options:", errorText);
        return {};
    }
}

/**
 * Set an option value. Creates the option if it doesn't exist.
 */
export async function setOption(key: string, value: string, autoload = true): Promise<{ success: boolean; error?: string }> {
    try {
        await db
            .insert(options)
            .values({ key, value, autoload })
            .onConflictDoUpdate({
                target: options.key,
                set: { value, autoload },
            });

        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error(`Error setting option ${key}:`, error);
        return { success: false, error: "Failed to update setting." };
    }
}

/**
 * Set multiple options at once.
 */
export async function setOptions(settings: Record<string, string>): Promise<{ success: boolean; error?: string }> {
    try {
        const values = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
            autoload: true, // Default to true for most settings
        }));

        await db
            .insert(options)
            .values(values)
            .onConflictDoUpdate({
                target: options.key,
                set: {
                    value: sql`excluded.value`,
                    autoload: sql`excluded.autoload`,
                },
            });

        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        console.error("Error setting multiple options:", error);
        return { success: false, error: "Failed to update settings." };
    }
}
