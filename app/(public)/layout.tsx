import { getCachedOptions, getCachedOption } from "@/lib/queries/options";
import { getCachedMenuWithItems } from "@/lib/queries/menus";
import { getCacheTimestamp } from "@/lib/queries/cache-timestamp";
import { activeTheme } from "@/lib/themes";
import type { ContactItem } from "@/lib/themes";
import { redirect } from "next/navigation";
import { dbGuard } from "@/lib/db-guard";
import { headers } from "next/headers";

const ThemeLayout = activeTheme.ThemeLayout;

export const revalidate = 3600;

export async function generateMetadata() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (host ? `${protocol}://${host}` : "http://localhost:3000");

    const options = await getCachedOptions([
        "site_title",
        "site_tagline",
    ]);

    const siteTitle = options.site_title || "MERPATI CMS";
    const siteTagline = options.site_tagline || "";
    const description = siteTagline.length >= 70
        ? siteTagline
        : siteTagline
            ? `${siteTagline} — Platform berita dan media digital yang ringkas, praktis, aman, dan tetap independen.`
            : "Platform berita dan media digital yang ringkas, praktis, aman, dan tetap independen. Baca artikel terbaru seputar berita lokal dan nasional.";

    return {
        title: {
            default: `${siteTitle} — ${siteTagline || "Berita Terkini"}`,
            template: `%s — ${siteTitle}`,
        },
        description,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: baseUrl,
        },
        openGraph: {
            title: `${siteTitle} — ${siteTagline || "Berita Terkini"}`,
            description,
            siteName: siteTitle,
            type: "website",
            url: baseUrl,
        },
        twitter: {
            card: "summary_large_image",
            title: `${siteTitle} — ${siteTagline || "Berita Terkini"}`,
            description,
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
