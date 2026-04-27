"use server";

import { db } from "@/db";
import { menus, menuItems } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkRole } from "@/lib/rbac";

// ─── Menu Actions ───────────────────────────────────────────────────────────

export async function getMenus() {
    return db.select().from(menus);
}

export async function createMenu(name: string, slug: string, location?: string | null) {
    try {
        await checkRole(["super_user"]);
        const [newMenu] = await db
            .insert(menus)
            .values({ name, slug, location })
            .returning();
        revalidatePath("/admin/menus");
        return { success: true as const, data: newMenu };
    } catch (error) {
        return { success: false as const, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function updateMenu(id: string, name: string, slug: string, location?: string | null) {
    try {
        await checkRole(["super_user"]);
        const [updatedMenu] = await db
            .update(menus)
            .set({ name, slug, location })
            .where(eq(menus.id, id))
            .returning();
        revalidatePath("/admin/menus");
        return { success: true as const, data: updatedMenu };
    } catch (error) {
        return { success: false as const, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function deleteMenu(id: string) {
    try {
        await checkRole(["super_user"]);
        await db.delete(menus).where(eq(menus.id, id));
        revalidatePath("/admin/menus");
        return { success: true as const };
    } catch (error) {
        return { success: false as const, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

// ─── Menu Item Actions ──────────────────────────────────────────────────────

export async function getMenuItems(menuId: string) {
    return db
        .select()
        .from(menuItems)
        .where(eq(menuItems.menuId, menuId))
        .orderBy(asc(menuItems.sortOrder));
}

export interface SaveMenuItemInput {
    title: string;
    url: string | null;
    objectId?: string | null;
    type: "custom" | "post" | "page" | "category";
    parentId?: string | null;
}

export async function saveMenuItems(menuId: string, items: SaveMenuItemInput[]) {
    try {
        await checkRole(["super_user"]);
        // Delete all current items and re-insert (no transactions in neon-http)
        await db.delete(menuItems).where(eq(menuItems.menuId, menuId));

        if (items.length > 0) {
            await db.insert(menuItems).values(
                items.map((item, index) => ({
                    menuId,
                    title: item.title,
                    url: item.url,
                    objectId: item.objectId,
                    type: item.type,
                    parentId: item.parentId,
                    sortOrder: index,
                }))
            );
        }

        revalidatePath("/admin/menus");
        return { success: true as const };
    } catch (error) {
        return { success: false as const, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
