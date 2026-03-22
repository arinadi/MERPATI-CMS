import { db } from "@/db";
import { posts, terms, termRelationships } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { activeTheme } from "@/lib/themes";
import { getCachedOptions } from "@/lib/queries/options";
import { unstable_cache } from "next/cache";
import { dbGuard } from "@/lib/db-guard";

const HomeComp = activeTheme.Home || activeTheme.Archive;

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
    const options = await getCachedOptions(["site_title", "site_tagline"]);
    return {
        title: options.site_title || "MERPATI CMS",
        description: options.site_tagline,
    };
}

export default async function HomePage() {
    const [hydratedPosts, options] = await dbGuard(async () => {
        const p = await getCachedHomePosts();
        const o = await getCachedOptions(["site_tagline"]);
        return [p, o] as const;
    });

    return (
        <HomeComp
            title="Artikel Terbaru"
            description={options.site_tagline || "Baca berita dan artikel terbaru kami."}
            posts={hydratedPosts}
        />
    );
}
