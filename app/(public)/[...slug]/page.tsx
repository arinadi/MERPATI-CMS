import { getFeaturedImageUrl } from "@/lib/utils/featured-image";
import { activeTheme } from "@/lib/themes";
import { getCachedOption } from "@/lib/queries/options";
import { 
    getCachedPost, 
    getCachedPage, 
    getCachedMetadata, 
    getCachedTaxonomyPosts, 
    getCachedArchivePosts, 
    getCachedSearchResults 
} from "@/lib/queries/posts";
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

// ─── Shared Logic ──────────────────────────────────────────────────────

const makeAbsolute = (url: string | null | undefined, baseUrl: string) => {
    if (!url) return undefined;
    const trimmed = url.trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("//")) return trimmed;
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanUrl = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${cleanBase}${cleanUrl}`;
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
        const ogImage = {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: meta.title,
        };
        (result.openGraph as Record<string, unknown>).images = [ogImage];
        (result.openGraph as Record<string, unknown>).type = meta.type === "post" ? "article" : "website";

        if (meta.type === "post") {
            const articleMeta: Record<string, string> = {};
            if (meta.publishedTime) articleMeta.publishedTime = meta.publishedTime;
            if (meta.modifiedTime) articleMeta.modifiedTime = meta.modifiedTime;
            if (meta.section) articleMeta.section = meta.section;
            if (meta.tags) articleMeta.tags = meta.tags;
            (result.openGraph as Record<string, unknown>).article = articleMeta;
        }

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
