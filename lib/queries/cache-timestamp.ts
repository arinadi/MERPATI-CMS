/**
 * Cached timestamp that freezes when the data cache is active.
 * When cache is cleared via revalidateTag, a NEW timestamp is generated.
 * This provides a reliable visual indicator of cache status.
 */

import { unstable_cache } from "next/cache";

export const getCacheTimestamp = unstable_cache(
    async () => {
        return new Date().toISOString();
    },
    ["cache-timestamp"],
    { revalidate: 3600, tags: ["site-options", "posts", "site-menus"] }
);
