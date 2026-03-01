"use client";

import { useState, useTransition, useRef } from "react";
import { saveTerm, deleteTerm } from "@/app/actions/terms";

type TermItem = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    count: number;
};

export default function TermsClient({
    initialTerms,
    type,
    title = "Terms"
}: {
    initialTerms: TermItem[],
    type: "category" | "tag",
    title?: string
}) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [parentId, setParentId] = useState("");

    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        if (slug) formData.append("slug", slug);
        if (description) formData.append("description", description);
        if (parentId) formData.append("parentId", parentId);

        startTransition(async () => {
            const result = await saveTerm(formData);
            if (result && "error" in result && result.error) {
                alert(result.error);
            } else {
                setName("");
                setSlug("");
                setDescription("");
                setParentId("");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this?")) {
            startTransition(async () => {
                const result = await deleteTerm(id);
                if (result && "error" in result && result.error) {
                    alert(result.error);
                }
            });
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>{title}</h1>
            </div>

            <div className="split-view">
                {/* Add Form */}
                <div className="card">
                    <div className="card-header"><h2>Add New {title}</h2></div>
                    <div className="card-body">
                        <form ref={formRef} onSubmit={handleSave} className="split-form">
                            <div className="form-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                    disabled={isPending}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label>Slug</label>
                                <input
                                    type="text"
                                    value={slug || name.toLowerCase().replace(/[^a-z0-9-]/g, "-")}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="auto-generated"
                                    disabled={isPending}
                                />
                            </div>
                            {type === "category" && (
                                <div className="form-field">
                                    <label>Parent Category</label>
                                    <select value={parentId} onChange={(e) => setParentId(e.target.value)} disabled={isPending}>
                                        <option value="">— None —</option>
                                        {initialTerms.filter(c => !c.parentId).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-field">
                                <label>Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Optional description..."
                                    disabled={isPending}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={isPending}>
                                {isPending ? "Adding..." : `Add New ${title.slice(0, -1)}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="card" style={{ overflow: "hidden" }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: "30px" }}><input type="checkbox" /></th>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {initialTerms.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "20px", color: "var(--admin-text-muted)" }}>
                                        No entries found.
                                    </td>
                                </tr>
                            )}
                            {initialTerms.map((term) => (
                                <tr key={term.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>
                                        <div>
                                            <span style={{ fontWeight: 500, color: "var(--admin-primary)" }}>
                                                {term.parentId ? "— " : ""}{term.name}
                                            </span>
                                        </div>
                                        <div className="row-actions">
                                            <button>Edit</button>
                                            <span className="row-actions-sep">|</span>
                                            <button className="danger" onClick={() => handleDelete(term.id)} disabled={isPending}>Delete</button>
                                        </div>
                                    </td>
                                    <td>{term.slug}</td>
                                    <td>{term.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
