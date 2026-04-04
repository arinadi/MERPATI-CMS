import { getCachedOptions, getCachedOption } from "@/lib/queries/options";
import { getCachedMenuWithItems } from "@/lib/queries/menus";
import { getCacheTimestamp } from "@/lib/queries/cache-timestamp";
import { activeTheme } from "@/lib/themes";
import type { ContactItem } from "@/lib/themes";
import { redirect } from "next/navigation";
import { dbGuard } from "@/lib/db-guard";

const ThemeLayout = activeTheme.ThemeLayout;

export const revalidate = 3600;

export async function generateMetadata() {
    const options = await getCachedOptions([
        "site_title",
        "site_tagline",
    ]);

    const siteTitle = options.site_title || "MERPATI CMS";
    const siteTagline = options.site_tagline || "Media Editorial Ringkas, Praktis...";

    return {
        title: {
            default: `${siteTitle} — ${siteTagline}`,
            template: `%s — ${siteTitle}`,
        },
        description: siteTagline,
        openGraph: {
            title: `${siteTitle} — ${siteTagline}`,
            description: siteTagline,
            siteName: siteTitle,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${siteTitle} — ${siteTagline}`,
            description: siteTagline,
        },
    };
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const data = await dbGuard(async () => {
        const isInit = await getCachedOption("is_initialized");
        if (isInit !== "true") {
            redirect("/setup");
        }
        const options = await getCachedOptions([
            "site_title",
            "site_tagline",
            "site_logo",
            "site_contacts"
        ]);

        const siteTitle = options.site_title || "MERPATI CMS";
        const siteTagline = options.site_tagline || "Media Editorial Ringkas, Praktis...";
        const siteLogo = options.site_logo || "";

        let contacts: ContactItem[] = [];
        try {
            contacts = JSON.parse(options.site_contacts || "[]");
        } catch (e) {
            console.error("Failed to parse site_contacts", e);
        }

        const primaryMenu = await getCachedMenuWithItems("primary");
        const footerMenu = await getCachedMenuWithItems("footer");
        const cacheId = await getCacheTimestamp();

        return { siteTitle, siteTagline, siteLogo, contacts, primaryMenu, footerMenu, cacheId };
    });

    return (
        <ThemeLayout
            siteTitle={data.siteTitle}
            siteTagline={data.siteTagline}
            siteLogo={data.siteLogo}
            contacts={data.contacts}
            primaryMenu={data.primaryMenu}
            footerMenu={data.footerMenu}
            cacheId={data.cacheId}
        >
            {children}
        </ThemeLayout>
    );
}
