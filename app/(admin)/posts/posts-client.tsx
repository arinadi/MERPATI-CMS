"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deletePosts, updatePostStatus } from "@/app/actions/posts";
import { formatDate } from "@/lib/utils";

type PostClientProps = {
    initialPosts: {
        id: string;
        title: string;
        status: string;
        createdAt: Date;
        authorName: string | null;
        categories: string[];
    }[];
    basePath?: string;
};

export default function PostsClient({ initialPosts, basePath = "/posts" }: PostClientProps) {
    const [filter, setFilter] = useState<"all" | "published" | "draft" | "archived">("all");
    const [selected, setSelected] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const filtered = filter === "all"
        ? initialPosts
        : initialPosts.filter(p => p.status === filter);

    const counts = {
        all: initialPosts.length,
        published: initialPosts.filter(p => p.status === "published").length,
        draft: initialPosts.filter(p => p.status === "draft").length,
        archived: initialPosts.filter(p => p.status === "archived").length,
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selected.length === filtered.length) setSelected([]);
        else setSelected(filtered.map(p => p.id));
    };

    const handleBulkAction = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const action = new FormData(e.currentTarget).get("action") as string;
        if (!action || selected.length === 0) return;

        startTransition(async () => {
            if (action === "trash") {
                await deletePosts(selected);
            } else if (action === "publish") {
                await updatePostStatus(selected, "published");
            } else if (action === "draft") {
                await updatePostStatus(selected, "draft");
            }
            setSelected([]);
        });
    };

    return (
        <div>
            {/* Filter Tabs */}
            <div className="filter-tabs">
                {(["all", "published", "draft", "archived"] as const).map((tab, i) => (
                    <span key={tab}>
                        {i > 0 && <span className="filter-tab-sep">|</span>}
                        <button
                            className={`filter-tab ${filter === tab ? "active" : ""}`}
                            onClick={() => { setFilter(tab); setSelected([]); }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
                        </button>
                    </span>
                ))}
            </div>

            {/* Bulk Actions */}
            <form onSubmit={handleBulkAction} className="bulk-bar">
                <select name="action" disabled={isPending || selected.length === 0}>
                    <option value="">Bulk Actions</option>
                    <option value="publish">Publish</option>
                    <option value="draft">Move to Draft</option>
                    <option value="trash">Delete</option>
                </select>
                <button type="submit" className="btn btn-secondary" disabled={isPending || selected.length === 0}>
                    {isPending ? "Applying..." : "Apply"}
                </button>
                <div style={{ marginLeft: "auto" }}>
                    <input type="search" placeholder="Search posts..." className="search-input" />
                </div>
            </form>

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
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center", padding: "20px", color: "var(--admin-text-muted)" }}>
                                    No posts found.
                                </td>
                            </tr>
                        )}
                        {filtered.map((post) => (
                            <tr key={post.id} className={isPending && selected.includes(post.id) ? "opacity-50" : ""}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(post.id)}
                                        onChange={() => toggleSelect(post.id)}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <Link href={`${basePath}/${post.id}/edit`} style={{ fontWeight: 500 }}>
                                            {post.title}
                                        </Link>
                                        {post.status === "draft" && <span className="badge badge-draft" style={{ marginLeft: 8 }}>Draft</span>}
                                        {post.status === "archived" && <span className="badge badge-draft" style={{ marginLeft: 8 }}>Archived</span>}
                                    </div>
                                    <div className="row-actions">
                                        <Link href={`${basePath}/${post.id}/edit`}>Edit</Link>
                                        <span className="row-actions-sep">|</span>
                                        <button className="danger" onClick={() => {
                                            if (confirm("Are you sure?")) {
                                                startTransition(() => { deletePosts([post.id]); });
                                            }
                                        }}>Trash</button>
                                        {post.status === "published" && (
                                            <>
                                                <span className="row-actions-sep">|</span>
                                                <a href="#" target="_blank">View</a>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td>{post.authorName}</td>
                                <td>{post.categories.join(", ")}</td>
                                <td>
                                    <div>{formatDate(post.createdAt)}</div>
                                    <div style={{ fontSize: "12px", color: "var(--admin-text-muted)" }}>
                                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
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
