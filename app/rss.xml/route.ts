import { Feed } from 'feed';
import { db } from '@/db';
import { posts, users, options } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getBaseUrl } from '@/lib/get-base-url';

export async function GET() {
    const baseUrl = await getBaseUrl();

    const siteOptions = await db
        .select()
        .from(options)
        .where(and(eq(options.key, 'site_title'), eq(options.autoload, true)));

    const siteTitle = siteOptions.find(o => o.key === 'site_title')?.value || 'MERPATI CMS';
    const siteDescription = siteOptions.find(o => o.key === 'site_tagline')?.value || '';

    const feed = new Feed({
        title: siteTitle,
        description: siteDescription,
        id: baseUrl,
        link: baseUrl,
        language: 'id',
        favicon: `${baseUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, ${siteTitle}`,
        generator: 'MERPATI CMS',
        feedLinks: {
            rss2: `${baseUrl}/rss.xml`,
        },
    });

    const dbPosts = await db
        .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            content: posts.content,
            excerpt: posts.excerpt,
            createdAt: posts.createdAt,
            author: {
                name: users.name,
                email: users.email,
            },
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(and(eq(posts.status, 'published'), eq(posts.type, 'post')))
        .orderBy(desc(posts.createdAt))
        .limit(20);

    dbPosts.forEach((post) => {
        feed.addItem({
            title: post.title,
            id: `${baseUrl}/${post.slug}`,
            link: `${baseUrl}/${post.slug}`,
            description: post.excerpt || '',
            content: post.content || '',
            author: post.author ? [
                {
                    name: post.author.name || 'Admin',
                    email: post.author.email || undefined,
                },
            ] : [],
            date: post.createdAt || new Date(),
        });
    });

    return new Response(feed.rss2(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
