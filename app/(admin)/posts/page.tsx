"use client";

import Link from "next/link";
import { useState } from "react";

const dummyPosts = [
    { id: "1", title: "Breaking: Kebijakan Energi Baru Diumumkan Pemerintah", author: "Rina Sari", categories: ["Politik"], date: "28 Feb 2026", status: "published" as const },
    { id: "2", title: "Ekonomi Digital Indonesia Tumbuh 30% di Kuartal Pertama", author: "Budi Santoso", categories: ["Ekonomi"], date: "27 Feb 2026", status: "published" as const },
    { id: "3", title: "Wawancara Eksklusif: Menteri Pendidikan tentang Kurikulum Baru", author: "Rina Sari", categories: ["Pendidikan"], date: "27 Feb 2026", status: "draft" as const },
    { id: "4", title: "Analisis: Dampak Perubahan Iklim terhadap Pertanian Jawa", author: "Dewi Lestari", categories: ["Lingkungan"], date: "26 Feb 2026", status: "published" as const },
    { id: "5", title: "Tech Review: Smartphone Terbaru untuk Jurnalis Lapangan", author: "Budi Santoso", categories: ["Teknologi"], date: "25 Feb 2026", status: "draft" as const },
    { id: "6", title: "Olahraga: Timnas Garuda Menang 3-0 di Kualifikasi Piala Dunia", author: "Rina Sari", categories: ["Olahraga"], date: "24 Feb 2026", status: "published" as const },
    { id: "7", title: "Budaya: Festival Batik Nasional Digelar di Solo", author: "Dewi Lestari", categories: ["Budaya"], date: "23 Feb 2026", status: "published" as const },
    { id: "8", title: "Investigasi: Korupsi Dana Desa di Kabupaten X", author: "Budi Santoso", categories: ["Investigasi"], date: "22 Feb 2026", status: "trash" as const },
];

export default function PostsPage() {
    const [filter, setFilter] = useState<"all" | "published" | "draft" | "trash">("all");
    const [selected, setSelected] = useState<string[]>([]);

    const filtered = filter === "all"
        ? dummyPosts.filter(p => p.status !== "trash")
        : dummyPosts.filter(p => p.status === filter);

    const counts = {
        all: dummyPosts.filter(p => p.status !== "trash").length,
        published: dummyPosts.filter(p => p.status === "published").length,
        draft: dummyPosts.filter(p => p.status === "draft").length,
        trash: dummyPosts.filter(p => p.status === "trash").length,
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selected.length === filtered.length) setSelected([]);
        else setSelected(filtered.map(p => p.id));
    };

    return (
        <div>
            <div className="page-header">
                <h1>Posts</h1>
                <Link href="/posts/new" className="btn btn-primary">Add New Post</Link>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {(["all", "published", "draft", "trash"] as const).map((tab, i) => (
                    <span key={tab}>
                        {i > 0 && <span className="filter-tab-sep">|</span>}
                        <button
                            className={`filter-tab ${filter === tab ? "active" : ""}`}
                            onClick={() => setFilter(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                        </button>
                    </span>
                ))}
            </div>

            {/* Bulk Actions */}
            <div className="bulk-bar">
                <select>
                    <option>Bulk Actions</option>
                    <option>Move to Trash</option>
                    <option>Publish</option>
                </select>
                <button className="btn btn-secondary">Apply</button>
                <div style={{ marginLeft: "auto" }}>
                    <input type="search" placeholder="Search posts..." className="search-input" />
                </div>
            </div>

            {/* Posts Table */}
            <div className="card" style={{ overflow: "hidden" }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: "30px" }}>
                                <input
                                    type="checkbox"
                                    checked={selected.length === filtered.length && filtered.length > 0}
                                    onChange={toggleAll}
                                />
                            </th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Categories</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((post) => (
                            <tr key={post.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(post.id)}
                                        onChange={() => toggleSelect(post.id)}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <Link href={`/posts/${post.id}/edit`} style={{ fontWeight: 500 }}>
                                            {post.title}
                                        </Link>
                                        {post.status === "draft" && <span className="badge badge-draft" style={{ marginLeft: 8 }}>Draft</span>}
                                        {post.status === "trash" && <span className="badge badge-trash" style={{ marginLeft: 8 }}>Trash</span>}
                                    </div>
                                    <div className="row-actions">
                                        <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                                        <span className="row-actions-sep">|</span>
                                        <button className="danger">Trash</button>
                                        {post.status === "published" && (
                                            <>
                                                <span className="row-actions-sep">|</span>
                                                <a href="#">View</a>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td>{post.author}</td>
                                <td>{post.categories.join(", ")}</td>
                                <td>
                                    <div>{post.date}</div>
                                    <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                                        {post.status === "published" ? "Published" : post.status === "draft" ? "Last Modified" : "Trashed"}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
                <span>Showing 1–{filtered.length} of {filtered.length} items</span>
                <div className="pagination-buttons">
                    <button disabled>‹</button>
                    <button className="active">1</button>
                    <button disabled>›</button>
                </div>
            </div>
        </div>
    );
}
