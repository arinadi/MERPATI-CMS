import { MetadataRoute } from 'next';
import { db } from '@/db';
import { posts, terms } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getBaseUrl } from '@/lib/get-base-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = await getBaseUrl();

    // 1. Fetch Posts
    const dbPosts = await db
        .select({
            slug: posts.slug,
            updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(and(eq(posts.status, 'published'), eq(posts.type, 'post')));

    const postEntries: MetadataRoute.Sitemap = dbPosts.map((post) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: post.updatedAt,
    }));

    // 2. Fetch Pages
    const dbPages = await db
        .select({
            slug: posts.slug,
            updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(and(eq(posts.status, 'published'), eq(posts.type, 'page')));

    const pageEntries: MetadataRoute.Sitemap = dbPages.map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt,
    }));

    // 3. Fetch Categories
    const dbCategories = await db
        .select({
            slug: terms.slug,
        })
        .from(terms)
        .where(eq(terms.taxonomy, 'category'));

    const categoryEntries: MetadataRoute.Sitemap = dbCategories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
    }));

    // 4. Fetch Tags
    const dbTags = await db
        .select({
            slug: terms.slug,
        })
        .from(terms)
        .where(eq(terms.taxonomy, 'tag'));

    const tagEntries: MetadataRoute.Sitemap = dbTags.map((tag) => ({
        url: `${baseUrl}/tag/${tag.slug}`,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...postEntries,
        ...pageEntries,
        ...categoryEntries,
        ...tagEntries,
    ];
}
