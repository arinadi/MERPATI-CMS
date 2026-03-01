import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import PostsClient from "./posts-client";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
    // 1. Fetch posts with author relation
    const allPosts = await db.query.posts.findMany({
        where: eq(posts.type, "post"),
        orderBy: [desc(posts.createdAt)],
        with: {
            author: true,
            // later term relation for categories
        }
    });

    // 2. Format for client component
    const formattedPosts = allPosts.map(p => ({
        id: p.id,
        title: p.title,
        status: p.status,
        createdAt: p.createdAt,
        authorName: p.author?.name || "Unknown",
        categories: [] // placeholder categories
    }));

    return (
        <div>
            <div className="page-header">
                <h1>Posts</h1>
                <Link href="/posts/new" className="btn btn-primary">Add New Post</Link>
            </div>

            <PostsClient initialPosts={formattedPosts} />
        </div>
    );
}
