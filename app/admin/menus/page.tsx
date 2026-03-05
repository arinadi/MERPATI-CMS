import { db } from "@/db";
import { menus, posts, terms } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import MenuManager, { Menu, MenuItem } from "@/components/admin/menus/menu-manager";
import { getMenuItems } from "@/lib/actions/menus";

export const dynamic = "force-dynamic";

export default async function MenusPage({
    searchParams,
}: {
    searchParams: Promise<{ menuId?: string }>;
}) {
    const { menuId } = await searchParams;

    // Fetch all menus for the selector
    const allMenus = await db.select().from(menus) as Menu[];

    // Fetch active menu structure
    let activeMenu: Menu | null = null;
    let activeItems: MenuItem[] = [];

    if (menuId) {
        [activeMenu] = await db.select().from(menus).where(eq(menus.id, menuId)).limit(1);
        if (activeMenu) {
            activeItems = await getMenuItems(activeMenu.id);
        }
    } else if (allMenus.length > 0) {
        activeMenu = allMenus[0];
        activeItems = await getMenuItems(activeMenu.id);
    }

    // Fetch content for the "Add Items" sidebar
    const recentPosts = await db
        .select({ id: posts.id, title: posts.title, slug: posts.slug })
        .from(posts)
        .where(and(eq(posts.status, "published"), eq(posts.type, "post")))
        .limit(10);

    const recentPages = await db
        .select({ id: posts.id, title: posts.title, slug: posts.slug })
        .from(posts)
        .where(and(eq(posts.status, "published"), eq(posts.type, "page")))
        .limit(10);

    const allCategories = await db
        .select({ id: terms.id, name: terms.name, slug: terms.slug })
        .from(terms)
        .where(eq(terms.taxonomy, "category"));

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Menus</h2>
            </div>

            <MenuManager
                allMenus={allMenus}
                activeMenu={activeMenu}
                activeItems={activeItems}
                availableContent={{
                    posts: recentPosts,
                    pages: recentPages,
                    categories: allCategories,
                }}
            />
        </div>
    );
}
