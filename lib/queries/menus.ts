/**
 * Cached menu queries for the public layout.
 * NOT server actions — safe for static/ISR caching.
 */

import { db } from "@/db";
import { menus, menuItems, posts, terms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getCachedMenuWithItems = unstable_cache(
    async (location: "primary" | "footer") => {
        const [menu] = await db
            .select()
            .from(menus)
            .where(eq(menus.location, location))
            .limit(1);

        if (!menu) return [];

        const rawItems = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.menuId, menu.id))
            .orderBy(menuItems.sortOrder);

        const items = await Promise.all(
            rawItems.map(async (item) => {
                if (item.type === "custom") return item;

                let slug = "";
                if (item.type === "post" || item.type === "page") {
                    const [p] = await db
                        .select({ slug: posts.slug })
                        .from(posts)
                        .where(eq(posts.id, item.objectId!))
                        .limit(1);
                    slug = p?.slug || "";
                } else if (item.type === "category") {
                    const [t] = await db
                        .select({ slug: terms.slug })
                        .from(terms)
                        .where(eq(terms.id, item.objectId!))
                        .limit(1);
                    slug = t ? `category/${t.slug}` : "";
                }

                return { ...item, slug };
            })
        );

        return items;
    },
    ["site-menus"],
    { revalidate: 3600, tags: ["site-menus"] }
);
