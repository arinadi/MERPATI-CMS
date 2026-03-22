/**
 * READ-ONLY option queries. These are NOT server actions ("use server")
 * so Next.js can cache them properly via unstable_cache / ISR.
 */

import { db } from "@/db";
import { options } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";

/**
 * Get a single option value by key (cached).
 */
export const getCachedOption = unstable_cache(
    async (key: string): Promise<string | null> => {
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
    },
    ["site-option"],
    { revalidate: 3600, tags: ["site-options"] }
);

/**
 * Get multiple options by their keys (cached).
 */
export const getCachedOptions = unstable_cache(
    async (keys: string[]): Promise<Record<string, string>> => {
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
    },
    ["site-options"],
    { revalidate: 3600, tags: ["site-options"] }
);
