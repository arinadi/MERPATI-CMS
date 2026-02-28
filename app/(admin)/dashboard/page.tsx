"use client";

import Link from "next/link";

const stats = {
    posts: 12,
    pages: 3,
    media: 45,
    users: 2,
};

const recentPosts = [
    { id: "1", title: "Breaking: Kebijakan Energi Baru Diumumkan Pemerintah", author: "Rina Sari", date: "28 Feb 2026", status: "published" },
    { id: "2", title: "Ekonomi Digital Indonesia Tumbuh 30% di Kuartal Pertama", author: "Budi Santoso", date: "27 Feb 2026", status: "published" },
    { id: "3", title: "Wawancara Eksklusif: Menteri Pendidikan tentang Kurikulum Baru", author: "Rina Sari", date: "27 Feb 2026", status: "draft" },
    { id: "4", title: "Analisis: Dampak Perubahan Iklim terhadap Pertanian Jawa", author: "Dewi Lestari", date: "26 Feb 2026", status: "published" },
    { id: "5", title: "Tech Review: Smartphone Terbaru untuk Jurnalis Lapangan", author: "Budi Santoso", date: "25 Feb 2026", status: "draft" },
];

export default function DashboardPage() {
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
                        <div className="quick-draft-form">
                            <input type="text" placeholder="Judul" />
                            <textarea placeholder="Tulis sesuatu..." />
                            <div>
                                <button className="btn btn-primary">Save Draft</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="card full-width">
                    <div className="card-header"><h2>Post Terbaru</h2></div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <ul className="recent-posts-list">
                            {recentPosts.map((post) => (
                                <li key={post.id} className="recent-post-item" style={{ padding: "10px 12px" }}>
                                    <span className="recent-post-title">{post.title}</span>
                                    <div className="recent-post-meta">
                                        <span>{post.author}</span>
                                        <span>{post.date}</span>
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
