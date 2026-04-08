import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/get-base-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
    const baseUrl = await getBaseUrl();

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/", "/login", "/setup"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
