import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import PostsClient from "../posts/posts-client";

export const dynamic = "force-dynamic";

export default async function PagesManagePage() {
    const allPages = await db.query.posts.findMany({
        where: eq(posts.type, "page"),
        orderBy: [desc(posts.createdAt)],
        with: {
            author: true,
        }
    });

    const formattedPages = allPages.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        createdAt: p.createdAt,
        authorName: p.author?.name || "Unknown",
        categories: []
    }));

    return (
        <div>
            <div className="page-header">
                <h1>Pages</h1>
                <Link href="/pages-manage/new" className="btn btn-primary">Add New Page</Link>
            </div>

            <PostsClient initialPosts={formattedPages} basePath="/pages-manage" />
        </div>
    );
}
