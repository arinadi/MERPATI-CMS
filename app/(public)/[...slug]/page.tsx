import { db } from "@/db";
import { posts, users, terms, termRelationships, postRelationships } from "@/db/schema";
import { eq, and, desc, inArray, ne } from "drizzle-orm";
import { activeTheme } from "@/lib/themes";
import type { PostCardData } from "@/lib/themes";

const SinglePost = activeTheme.SinglePost;
const SinglePage = activeTheme.SinglePage;
const Archive = activeTheme.Archive;
const NotFoundComponent = activeTheme.NotFound;

interface PublicPageProps {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PublicPageProps) {
    const { slug } = await params;
    const fullSlug = slug.join("/");

    if (slug[0] === "category" || slug[0] === "tag") {
        const [term] = await db
            .select()
            .from(terms)
            .where(and(eq(terms.slug, slug[1]), eq(terms.taxonomy, slug[0])))
            .limit(1);

        if (term) {
            return {
                title: term.name,
                description: term.description,
            };
        }
    }

    const [post] = await db
        .select()
        .from(posts)
        .where(
            and(
                eq(posts.slug, fullSlug),
                eq(posts.status, "published")
            )
        )
        .limit(1);

    if (post) {
        return {
            title: post.title,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt || undefined,
                images: post.featuredImage ? [post.featuredImage] : [],
                type: post.type === "post" ? "article" : "website",
            },
            twitter: {
                card: "summary_large_image",
                title: post.title,
                description: post.excerpt || undefined,
                images: post.featuredImage ? [post.featuredImage] : [],
            },
        };
    }

    return {};
}

export default async function PublicPage({ params }: PublicPageProps) {
    const { slug } = await params;
    const fullSlug = slug.join("/");

    // ── Category / Tag routes ──────────────────────────────────────────
    if (slug[0] === "category" && slug[1]) {
        return handleTaxonomy(slug[1], "category");
    }
    if (slug[0] === "tag" && slug[1]) {
        return handleTaxonomy(slug[1], "tag");
    }

    // ── Try to find a Post ─────────────────────────────────────────────
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
                eq(posts.slug, fullSlug),
                eq(posts.status, "published"),
                eq(posts.type, "post")
            )
        )
        .limit(1);

    if (post) {
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

        // ── Fetch Related Posts (from explicit relationships) ──────────────
        const explicitRelations = await db
            .select({
                relatedPostId: postRelationships.relatedPostId,
            })
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

            // Hydrate categories for PostCard
            relatedPosts = await Promise.all(
                related.map(async (rp) => {
                    const rpCategories = await db
                        .select({
                            id: terms.id,
                            name: terms.name,
                            slug: terms.slug,
                        })
                        .from(termRelationships)
                        .innerJoin(terms, eq(termRelationships.termId, terms.id))
                        .where(and(eq(termRelationships.objectId, rp.id), eq(terms.taxonomy, "category")));

                    return { ...rp, categories: rpCategories };
                })
            );
        }

        return <SinglePost post={{ ...post, categories, tags }} relatedPosts={relatedPosts} />;
    }

    // ── Try to find a Page ─────────────────────────────────────────────
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
                eq(posts.slug, fullSlug),
                eq(posts.status, "published"),
                eq(posts.type, "page")
            )
        )
        .limit(1);

    if (page) {
        return <SinglePage page={page} />;
    }

    // ── Not Found ──────────────────────────────────────────────────────
    return <NotFoundComponent />;
}

async function handleTaxonomy(slug: string, taxonomy: "category" | "tag") {
    const [term] = await db
        .select()
        .from(terms)
        .where(and(eq(terms.slug, slug), eq(terms.taxonomy, taxonomy)))
        .limit(1);

    if (!term) {
        return <NotFoundComponent />;
    }

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
        .orderBy(desc(posts.createdAt));

    const hydratedPosts = await Promise.all(
        termPosts.map(async (p) => {
            const categories = await db
                .select({
                    id: terms.id,
                    name: terms.name,
                    slug: terms.slug,
                })
                .from(termRelationships)
                .innerJoin(terms, eq(termRelationships.termId, terms.id))
                .where(and(eq(termRelationships.objectId, p.id), eq(terms.taxonomy, "category")));

            return { ...p, categories };
        })
    );

    return <Archive title={term.name} description={term.description || ""} posts={hydratedPosts} />;
}
