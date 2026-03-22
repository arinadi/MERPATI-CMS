"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function clearGlobalCache() {
    try {
        // Invalidate all cache tags used by unstable_cache
        revalidateTag("site-options", "default");
        revalidateTag("site-menus", "default");
        revalidateTag("posts", "default");

        // Also invalidate the full route cache
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
