import Link from "next/link";
import { db } from "@/db";
import { posts, users, media } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";
import QuickDraftForm from "./quick-draft-form";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    // 1. Fetch counts
    const [postsCount] = await db.select({ value: count() }).from(posts).where(eq(posts.type, "post"));
    const [pagesCount] = await db.select({ value: count() }).from(posts).where(eq(posts.type, "page"));
    const [mediaCount] = await db.select({ value: count() }).from(media);
    const [usersCount] = await db.select({ value: count() }).from(users);

    const stats = {
        posts: postsCount.value,
        pages: pagesCount.value,
        media: mediaCount.value,
        users: usersCount.value,
    };

    // 2. Fetch recent posts
    const recentPosts = await db.query.posts.findMany({
        where: eq(posts.type, "post"),
        orderBy: [desc(posts.createdAt)],
        limit: 5,
        with: {
            author: true
        }
    });

    return (
        <div>
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="dashboard-grid">
                {/* At a Glance */}
                <div className="card">
                    <div className="card-header"><h2>Sekilas Info</h2></div>
                    <div className="card-body">
                        <div className="glance-grid">
                            <Link href="/posts" className="glance-item">
                                <span className="glance-icon">📝</span>
                                <div>
                                    <div className="glance-count">{stats.posts}</div>
                                    <div className="glance-label">Posts</div>
                                </div>
                            </Link>
                            <Link href="/pages-manage" className="glance-item">
                                <span className="glance-icon">📄</span>
                                <div>
                                    <div className="glance-count">{stats.pages}</div>
                                    <div className="glance-label">Pages</div>
                                </div>
                            </Link>
                            <Link href="/media" className="glance-item">
                                <span className="glance-icon">📷</span>
                                <div>
                                    <div className="glance-count">{stats.media}</div>
                                    <div className="glance-label">Media</div>
                                </div>
                            </Link>
                            <Link href="/users" className="glance-item">
                                <span className="glance-icon">👤</span>
                                <div>
                                    <div className="glance-count">{stats.users}</div>
                                    <div className="glance-label">Users</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Draft */}
                <div className="card">
                    <div className="card-header"><h2>Quick Draft</h2></div>
                    <div className="card-body">
                        <QuickDraftForm />
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="card full-width">
                    <div className="card-header"><h2>Post Terbaru</h2></div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <ul className="recent-posts-list">
                            {recentPosts.length === 0 ? (
                                <li className="recent-post-item" style={{ padding: "16px", color: "var(--admin-text-muted)" }}>
                                    Belum ada post. Mulai menulis!
                                </li>
                            ) : null}
                            {recentPosts.map((post) => (
                                <li key={post.id} className="recent-post-item" style={{ padding: "10px 12px" }}>
                                    <span className="recent-post-title">
                                        <Link href={`/posts/${post.id}/edit`} style={{ color: "inherit", textDecoration: "none" }}>{post.title}</Link>
                                    </span>
                                    <div className="recent-post-meta">
                                        <span>{post.author?.name || "Unknown"}</span>
                                        <span>{formatDate(post.createdAt)}</span>
                                        <span className={`badge badge-${post.status}`}>
                                            {post.status === "published" ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
