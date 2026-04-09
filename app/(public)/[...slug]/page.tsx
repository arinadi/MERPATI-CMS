import { db } from "@/db";
import { getFeaturedImageUrl } from "@/lib/utils/featured-image";
import { posts, users, terms, termRelationships, postRelationships } from "@/db/schema";
import { eq, and, desc, inArray, count, ilike, or } from "drizzle-orm";
import { activeTheme } from "@/lib/themes";
import type { PostCardData } from "@/lib/themes";
import { getCachedOption } from "@/lib/queries/options";
import { unstable_cache } from "next/cache";
import { dbGuard } from "@/lib/db-guard";
import { getBaseUrl } from "@/lib/get-base-url";
import { notFound } from "next/navigation";

const SinglePost = activeTheme.SinglePost;
const SinglePage = activeTheme.SinglePage;
const Archive = activeTheme.Archive;

interface PublicPageProps {
    params: Promise<{ slug: string[] }>;
}

export const revalidate = 3600;

// ─── Cached DB query functions ─────────────────────────────────────────

const getCachedPost = unstable_cache(
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

            relatedPosts = await Promise.all(
                related.map(async (rp) => {
                    const rpCategories = await db
                        .select({ id: terms.id, name: terms.name, slug: terms.slug })
                        .from(termRelationships)
                        .innerJoin(terms, eq(termRelationships.termId, terms.id))
                        .where(and(eq(termRelationships.objectId, rp.id), eq(terms.taxonomy, "category")));
                    return { ...rp, categories: rpCategories };
                })
            );
        }

        return { post: { ...post, categories, tags }, relatedPosts };
    },
    ["single-post"],
    { revalidate: 3600, tags: ["posts"] }
);

const getCachedPage = unstable_cache(
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

const getCachedMetadata = unstable_cache(
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
            .select()
            .from(posts)
            .where(and(eq(posts.slug, fullSlug), eq(posts.status, "published")))
            .limit(1);

        if (post) {
            return {
                title: post.title,
                description: post.excerpt,
                featuredImage: post.featuredImage,
                type: post.type,
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

const getCachedTaxonomyPosts = unstable_cache(
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

        const hydratedPosts = await Promise.all(
            termPosts.map(async (p) => {
                const categories = await db
                    .select({ id: terms.id, name: terms.name, slug: terms.slug })
                    .from(termRelationships)
                    .innerJoin(terms, eq(termRelationships.termId, terms.id))
                    .where(and(eq(termRelationships.objectId, p.id), eq(terms.taxonomy, "category")));
                return { ...p, categories };
            })
        );

        return { term, total, hydratedPosts };
    },
    ["taxonomy-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

const getCachedArchivePosts = unstable_cache(
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

        const hydratedPosts = await Promise.all(
            allPosts.map(async (p) => {
                const categories = await db
                    .select({ id: terms.id, name: terms.name, slug: terms.slug })
                    .from(termRelationships)
                    .innerJoin(terms, eq(termRelationships.termId, terms.id))
                    .where(and(eq(termRelationships.objectId, p.id), eq(terms.taxonomy, "category")));
                return { ...p, categories };
            })
        );

        return { total, hydratedPosts };
    },
    ["archive-posts"],
    { revalidate: 3600, tags: ["posts"] }
);

const getCachedSearchResults = unstable_cache(
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

        const hydratedPosts = await Promise.all(
            results.map(async (p) => {
                const categories = await db
                    .select({ id: terms.id, name: terms.name, slug: terms.slug })
                    .from(termRelationships)
                    .innerJoin(terms, eq(termRelationships.termId, terms.id))
                    .where(and(eq(termRelationships.objectId, p.id), eq(terms.taxonomy, "category")));
                return { ...p, categories };
            })
        );

        return { total, hydratedPosts };
    },
    ["search-results"],
    { revalidate: 3600, tags: ["posts"] }
);

const makeAbsolute = (url: string | null | undefined, baseUrl: string) => {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

// ─── Metadata ──────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PublicPageProps) {
    const { slug } = await params;
    const fullSlug = slug.join("/");
    const meta = await getCachedMetadata(fullSlug, slug[0], slug[1]);
    const faviconUrl = await getCachedOption("favicon");
    const siteTitle = await getCachedOption("site_title") || "MERPATI CMS";
    const siteLogo = await getCachedOption("site_logo");
    const baseUrl = await getBaseUrl();
    const canonicalUrl = `${baseUrl}/${fullSlug}`;

    if (!meta) return {};

    const imageUrl = makeAbsolute(getFeaturedImageUrl(meta.featuredImage), baseUrl) || makeAbsolute(siteLogo, baseUrl);

    const result: Record<string, unknown> = {
        title: meta.title,
        description: meta.description,
        icons: {
            icon: faviconUrl || "/favicon.ico",
        },
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: meta.title,
            description: meta.description || undefined,
            url: canonicalUrl,
            type: "website",
            siteName: siteTitle,
            locale: "id_ID",
        },
    };

    if (imageUrl) {
        (result.openGraph as Record<string, unknown>).images = [imageUrl];
        (result.openGraph as Record<string, unknown>).type = meta.type === "post" ? "article" : "website";
        result.twitter = {
            card: "summary_large_image",
            title: meta.title,
            description: meta.description || undefined,
            images: [imageUrl],
        };
    }

    return result;
}

// ─── Page Component ────────────────────────────────────────────────────

export default async function PublicPage(props: PublicPageProps) {
    const params = await props.params;
    const rawSlug = params.slug;
    const baseUrl = await getBaseUrl();

    // Extract page number if present
    let pageNum = 1;
    let slug = [...rawSlug];
    const pageIndex = slug.lastIndexOf("page");
    if (pageIndex !== -1 && pageIndex === slug.length - 2) {
        const parsedPage = parseInt(slug[slug.length - 1]!, 10);
        if (!isNaN(parsedPage) && parsedPage > 0) {
            pageNum = parsedPage;
            slug = slug.slice(0, pageIndex);
        }
    }

    const fullSlug = slug.join("/");

    const result = await dbGuard(async () => {
        const postsPerPageStr = await getCachedOption("posts_per_page") || "12";
        const limit = parseInt(postsPerPageStr, 10) || 12;
        const offset = Math.max(0, (pageNum - 1) * limit);

        // ── Category / Tag routes
        if (slug[0] === "category" && slug[1]) {
            const data = await getCachedTaxonomyPosts(slug[1], "category", limit, offset);
            if (!data) return { type: "notfound" as const };
            const totalPages = Math.ceil(data.total / limit);
            return { type: "archive" as const, title: data.term.name, description: data.term.description || "", posts: data.hydratedPosts, pagination: { currentPage: pageNum, totalPages, basePath: `/category/${slug[1]}` } };
        }
        if (slug[0] === "tag" && slug[1]) {
            const data = await getCachedTaxonomyPosts(slug[1], "tag", limit, offset);
            if (!data) return { type: "notfound" as const };
            const totalPages = Math.ceil(data.total / limit);
            return { type: "archive" as const, title: data.term.name, description: data.term.description || "", posts: data.hydratedPosts, pagination: { currentPage: pageNum, totalPages, basePath: `/tag/${slug[1]}` } };
        }

        // ── Archive Route
        if (slug[0] === "archive" && slug.length === 1) {
            const data = await getCachedArchivePosts(limit, offset);
            const totalPages = Math.ceil(data.total / limit);
            return { type: "archive" as const, title: "All Articles", description: "Explore our collection of published articles.", posts: data.hydratedPosts, pagination: { currentPage: pageNum, totalPages, basePath: "/archive" } };
        }

        // ── Search Route
        if (slug[0] === "search" && slug[1]) {
            const query = decodeURIComponent(slug[1]);
            const data = await getCachedSearchResults(query, limit, offset);
            const totalPages = Math.ceil(data.total / limit);
            return { type: "archive" as const, title: `Search results for: "${query}"`, description: `Found ${data.total} articles`, posts: data.hydratedPosts, pagination: totalPages > 1 ? { currentPage: pageNum, totalPages, basePath: `/search/${slug[1]}` } : undefined };
        }

        // ── Try to find a Post
        const postData = await getCachedPost(fullSlug);
        if (postData) {
            const sharingPlatforms = await getCachedOption("sharing_platforms");
            return { type: "post" as const, post: postData.post, relatedPosts: postData.relatedPosts, sharingPlatforms: sharingPlatforms || "" };
        }

        // ── Try to find a Page
        const page = await getCachedPage(fullSlug);
        if (page) {
            return { type: "page" as const, page };
        }

        return { type: "notfound" as const };
    });

    // ── Render based on result type (JSX outside try-catch)
    switch (result.type) {
        case "archive":
            return <Archive title={result.title} description={result.description} posts={result.posts} pagination={result.pagination} />;
        case "post": {
            const articleJsonLd = {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: result.post.title,
                description: result.post.excerpt || undefined,
                image: getFeaturedImageUrl(result.post.featuredImage) ? [makeAbsolute(getFeaturedImageUrl(result.post.featuredImage), baseUrl)] : [],
                datePublished: result.post.createdAt,
                dateModified: result.post.updatedAt || result.post.createdAt,
                author: [{
                    "@type": "Person",
                    name: result.post.author?.name || "Editor",
                    url: baseUrl
                }],
                publisher: {
                    "@type": "Organization",
                    name: await getCachedOption("site_title") || "MERPATI CMS",
                    logo: {
                        "@type": "ImageObject",
                        url: makeAbsolute(await getCachedOption("site_logo"), baseUrl) || `${baseUrl}/favicon.ico`
                    }
                }
            };
            return (
                <>
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                    />
                    <SinglePost post={result.post} relatedPosts={result.relatedPosts} sharingPlatforms={result.sharingPlatforms} />
                </>
            );
        }
        case "page":
            return <SinglePage page={result.page} />;
        default:
            notFound();
    }
}
