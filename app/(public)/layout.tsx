import { getOptions } from "@/lib/actions/options";
import { activeTheme } from "@/lib/themes";
import { db } from "@/db";
import { menus, menuItems, posts, terms } from "@/db/schema";
import { eq } from "drizzle-orm";

const ThemeLayout = activeTheme.ThemeLayout;

export async function generateMetadata() {
    const options = await getOptions([
        "site_title",
        "site_tagline",
    ]);

    const siteTitle = options.site_title || "MERPATI CMS";
    const siteTagline = options.site_tagline || "Media Editorial Ringkas, Praktis...";

    return {
        title: {
            default: `${siteTitle} | ${siteTagline}`,
            template: `%s | ${siteTitle}`,
        },
        description: siteTagline,
        openGraph: {
            title: siteTitle,
            description: siteTagline,
            siteName: siteTitle,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: siteTitle,
            description: siteTagline,
        },
    };
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const options = await getOptions([
        "site_title",
        "site_tagline",
        "site_contacts"
    ]);

    const siteTitle = options.site_title || "MERPATI CMS";
    const siteTagline = options.site_tagline || "Media Editorial Ringkas, Praktis...";

    let contacts = [];
    try {
        contacts = JSON.parse(options.site_contacts || "[]");
    } catch (e) {
        console.error("Failed to parse site_contacts", e);
    }

    async function getMenuWithItems(location: "primary" | "footer") {
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
    }

    const primaryMenu = await getMenuWithItems("primary");
    const footerMenu = await getMenuWithItems("footer");

    return (
        <ThemeLayout
            siteTitle={siteTitle}
            siteTagline={siteTagline}
            contacts={contacts}
            primaryMenu={primaryMenu}
            footerMenu={footerMenu}
        >
            {children}
        </ThemeLayout>
    );
}
