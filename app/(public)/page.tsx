import { db } from "@/db";
import { posts, terms, termRelationships } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { activeTheme } from "@/lib/themes";
import { getOptions } from "@/lib/actions/options";

const Archive = activeTheme.Archive;

export async function generateMetadata() {
    const options = await getOptions(["site_title", "site_tagline"]);
    return {
        title: options.site_title || "MERPATI CMS",
        description: options.site_tagline,
    };
}

export default async function HomePage() {
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

    const options = await getOptions(["site_tagline"]);

    return (
        <Archive
            title="Artikel Terbaru"
            description={options.site_tagline || "Baca berita dan artikel terbaru kami."}
            posts={hydratedPosts}
        />
    );
}
