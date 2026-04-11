import { db } from "@/db";
import { posts, users, terms, termRelationships, postRelationships } from "@/db/schema";
import { eq, and, desc, inArray, count, ilike, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { PostCardData } from "@/lib/themes";

/**
 * ─── HELPER: Hydrate Posts with Categories ────────────────────────────────
 * Fetches and attaches category data to a list of post results.
 */
async function hydratePosts(postResults: (Record<string, unknown> & { id: string })[]): Promise<PostCardData[]> {
    return Promise.all(
        postResults.map(async (p) => {
            const categories = await db
                .select({ id: terms.id, name: terms.name, slug: terms.slug })
                .from(termRelationships)
                .innerJoin(terms, eq(termRelationships.termId, terms.id))
                .where(and(eq(termRelationships.objectId, p.id as string), eq(terms.taxonomy, "category")));
            return { ...p, categories: categories || [] } as PostCardData;
        })
    );
}

/**
 * ─── Get Single Post with Related ──────────────────────────────────────────
 */
export const getCachedPost = unstable_cache(
    async (slug: string) => {
        const [post] = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                content: posts.content,
                excerpt: posts.excerpt,
                status: posts.status,
                type: posts.type,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
                author: {
                    name: users.name,
                    image: users.image,
                },
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(
                and(
                    eq(posts.slug, slug),
                    eq(posts.status, "published"),
                    eq(posts.type, "post")
                )
            )
            .limit(1);

        if (!post) return null;

        const allTerms = await db
            .select({
                id: terms.id,
                name: terms.name,
                slug: terms.slug,
                taxonomy: terms.taxonomy,
            })
            .from(termRelationships)
            .innerJoin(terms, eq(termRelationships.termId, terms.id))
            .where(eq(termRelationships.objectId, post.id));

        const categories = allTerms.filter(t => t.taxonomy === "category").map(({ id, name, slug }) => ({ id, name, slug }));
        const tags = allTerms.filter(t => t.taxonomy === "tag").map(({ id, name, slug }) => ({ id, name, slug }));

        // Fetch Related Posts
        const explicitRelations = await db
            .select({ relatedPostId: postRelationships.relatedPostId })
            .from(postRelationships)
            .where(eq(postRelationships.postId, post.id));

        const relatedPostIds = explicitRelations.map((r) => r.relatedPostId);
        let relatedPosts: PostCardData[] = [];

        if (relatedPostIds.length > 0) {
            const related = await db
                .select({
                    id: posts.id,
                    title: posts.title,
                    slug: posts.slug,
                    excerpt: posts.excerpt,
                    featuredImage: posts.featuredImage,
                    createdAt: posts.createdAt,
                    author: { name: users.name },
                })
                .from(posts)
                .leftJoin(users, eq(posts.authorId, users.id))
                .where(
                    and(
                        inArray(posts.id, relatedPostIds),
                        eq(posts.status, "published"),
                        eq(posts.type, "post")
                    )
                )
                .orderBy(desc(posts.createdAt))
                .limit(3);

            relatedPosts = await hydratePosts(related);
        }

        return { post: { ...post, categories, tags }, relatedPosts };
    },
    ["single-post"],
    { revalidate: 3600, tags: ["posts"] }
);

/**
 * ─── Get Single Static Page ─────────────────────────────────────────────
 */
export const getCachedPage = unstable_cache(
    async (slug: string) => {
        const [page] = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                content: posts.content,
                excerpt: posts.excerpt,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
            })
            .from(posts)
            .where(
                and(
                    eq(posts.slug, slug),
                    eq(posts.status, "published"),
                    eq(posts.type, "page")
                )
            )
            .limit(1);

        return page || null;
    },
    ["single-page"],
    { revalidate: 3600, tags: ["posts"] }
);

/**
 * ─── Get Taxonomy Posts (Categories/Tags) ────────────────────────────────
 */
export const getCachedTaxonomyPosts = unstable_cache(
    async (slug: string, taxonomy: "category" | "tag", limit: number, offset: number) => {
        const [term] = await db
            .select()
            .from(terms)
            .where(and(eq(terms.slug, slug), eq(terms.taxonomy, taxonomy)))
            .limit(1);

        if (!term) return null;

        const [{ value: total }] = await db
            .select({ value: count() })
            .from(termRelationships)
            .innerJoin(posts, eq(termRelationships.objectId, posts.id))
            .where(
                and(
                    eq(termRelationships.termId, term.id),
                    eq(posts.status, "published"),
                    eq(posts.type, "post")
                )
            );

        const termPosts = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                excerpt: posts.excerpt,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
            })
            .from(termRelationships)
            .innerJoin(posts, eq(termRelationships.objectId, posts.id))
            .where(
                and(
                    eq(termRelationships.termId, term.id),
                    eq(posts.status, "published"),
                    eq(posts.type, "post")
                )
            )
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);

        const hydratedPosts = await hydratePosts(termPosts);
        return { term, total, hydratedPosts };
    },
    ["taxonomy-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

/**
 * ─── Get Archive Posts (All) ──────────────────────────────────────────────
 */
export const getCachedArchivePosts = unstable_cache(
    async (limit: number, offset: number) => {
        const [{ value: total }] = await db
            .select({ value: count() })
            .from(posts)
            .where(and(eq(posts.status, "published"), eq(posts.type, "post")));

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
            .limit(limit)
            .offset(offset);

        const hydratedPosts = await hydratePosts(allPosts);
        return { total, hydratedPosts };
    },
    ["archive-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

/**
 * ─── Get Search Results ───────────────────────────────────────────────────
 */
export const getCachedSearchResults = unstable_cache(
    async (query: string, limit: number, offset: number) => {
        const searchPattern = `%${query}%`;

        const [{ value: total }] = await db
            .select({ value: count() })
            .from(posts)
            .where(
                and(
                    eq(posts.status, "published"),
                    eq(posts.type, "post"),
                    or(
                        ilike(posts.title, searchPattern),
                        ilike(posts.excerpt, searchPattern),
                        ilike(posts.content, searchPattern)
                    )
                )
            );

        const results = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                excerpt: posts.excerpt,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
            })
            .from(posts)
            .where(
                and(
                    eq(posts.status, "published"),
                    eq(posts.type, "post"),
                    or(
                        ilike(posts.title, searchPattern),
                        ilike(posts.excerpt, searchPattern),
                        ilike(posts.content, searchPattern)
                    )
                )
            )
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);

        const hydratedPosts = await hydratePosts(results);
        return { total, hydratedPosts };
    },
    ["search-results"],
    { revalidate: 3600, tags: ["posts"] }
);

/**
 * ─── Get Page Metadata ────────────────────────────────────────────────────
 */
export const getCachedMetadata = unstable_cache(
    async (fullSlug: string, firstSegment: string, secondSegment?: string) => {
        if (firstSegment === "category" || firstSegment === "tag") {
            if (secondSegment) {
                const [term] = await db
                    .select()
                    .from(terms)
                    .where(and(eq(terms.slug, secondSegment), eq(terms.taxonomy, firstSegment)))
                    .limit(1);
                if (term) return { title: term.name, description: term.description };
            }
        }

        const [post] = await db
            .select({
                id: posts.id,
                title: posts.title,
                excerpt: posts.excerpt,
                content: posts.content,
                featuredImage: posts.featuredImage,
                type: posts.type,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
            })
            .from(posts)
            .where(and(eq(posts.slug, fullSlug), eq(posts.status, "published")))
            .limit(1);

        if (post) {
            let description = post.excerpt;
            if (!description && post.content) {
                const stripped = post.content.replace(/<[^>]*>/g, " ");
                description = stripped.length > 160 ? stripped.substring(0, 157) + "..." : stripped;
            }

            let section: string | undefined;
            let tags: string | undefined;

            if (post.type === "post") {
                const postTerms = await db
                    .select({ name: terms.name, taxonomy: terms.taxonomy })
                    .from(termRelationships)
                    .innerJoin(terms, eq(termRelationships.termId, terms.id))
                    .where(eq(termRelationships.objectId, post.id));

                section = postTerms.find(t => t.taxonomy === "category")?.name;
                tags = postTerms.filter(t => t.taxonomy === "tag").map(t => t.name).join(",");
            }

            return {
                title: post.title,
                description: description,
                featuredImage: post.featuredImage,
                type: post.type,
                publishedTime: post.createdAt.toISOString(),
                modifiedTime: post.updatedAt?.toISOString() || post.createdAt.toISOString(),
                section,
                tags,
            };
        }

        if (firstSegment === "archive") {
            return { title: "All Articles", description: "Explore our collection of published news and articles." };
        }

        return null;
    },
    ["page-metadata"],
    { revalidate: 3600, tags: ["posts"] }
);
/**
 * ─── Get Latest Posts (Generic) ──────────────────────────────────────────
 */
export const getLatestPosts = unstable_cache(
    async (limit: number) => {
        const results = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                excerpt: posts.excerpt,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
                author: { name: users.name },
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(and(eq(posts.status, "published"), eq(posts.type, "post")))
            .orderBy(desc(posts.createdAt))
            .limit(limit);

        return hydratePosts(results);
    },
    ["latest-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

/**
 * ─── Get Post By ID (Generic) ─────────────────────────────────────────────
 */
export const getCachedPostById = unstable_cache(
    async (id: string) => {
        const [post] = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                excerpt: posts.excerpt,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
                author: { name: users.name },
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(
                and(
                    eq(posts.id, id),
                    eq(posts.status, "published"),
                    eq(posts.type, "post")
                )
            )
            .limit(1);

        if (!post) return null;
        const hydrated = await hydratePosts([post]);
        return hydrated[0];
    },
    ["post-by-id"],
    { revalidate: 3600, tags: ["posts"] }
);
