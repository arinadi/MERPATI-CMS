import { db } from "@/db";
import { posts, terms, termRelationships } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { activeTheme } from "@/lib/themes";
import { getCachedOptions } from "@/lib/queries/options";
import { unstable_cache } from "next/cache";
import { dbGuard } from "@/lib/db-guard";
import type { HomeProps } from "@/lib/themes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HomeComp = (activeTheme.Home || activeTheme.Archive) as React.ComponentType<HomeProps & Record<string, any>>;

export const revalidate = 3600;

const getCachedHomePosts = unstable_cache(
    async () => {
        const allPosts = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                excerpt: posts.excerpt,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
            })
            .from(posts)
            .where(and(eq(posts.status, "published"), eq(posts.type, "post")))
            .orderBy(desc(posts.createdAt))
            .limit(12);

        const hydratedPosts = await Promise.all(
            allPosts.map(async (post) => {
                const categories = await db
                    .select({
                        id: terms.id,
                        name: terms.name,
                        slug: terms.slug,
                    })
                    .from(termRelationships)
                    .innerJoin(terms, eq(termRelationships.termId, terms.id))
                    .where(and(eq(termRelationships.objectId, post.id), eq(terms.taxonomy, "category")));

                return { ...post, categories };
            })
        );

        return hydratedPosts;
    },
    ["home-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

export async function generateMetadata() {
    const options = await getCachedOptions(["site_title", "site_tagline", "favicon"]);
    const siteTitle = options.site_title || "MERPATI CMS";
    const siteTagline = options.site_tagline || "";
    const fullTitle = siteTagline ? `${siteTitle} — ${siteTagline}` : siteTitle;

    return {
        title: {
            absolute: fullTitle,
        },
        description: siteTagline || undefined,
        icons: {
            icon: options.favicon || "/favicon.ico",
        },
    };
}

export default async function HomePage() {
    const [hydratedPosts, themeOptions] = await dbGuard(async () => {
        const p = await getCachedHomePosts();

        // Collect theme option keys and fetch their values
        const themeOptionKeys = (activeTheme.options || []).map(opt => opt.id);
        const themeOpts: Record<string, unknown> = {};
        if (themeOptionKeys.length > 0) {
            const fetched = await getCachedOptions(themeOptionKeys);
            for (const key of themeOptionKeys) {
                if (fetched[key] !== undefined) {
                    themeOpts[key] = fetched[key];
                }
            }
        }

        return [p, themeOpts] as const;
    });

    return (
        <HomeComp
            posts={hydratedPosts}
            themeOptions={themeOptions}
        />
    );
}
