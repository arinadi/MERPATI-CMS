"use client";

import { useState } from "react";

const dummyTags = [
    { id: "1", name: "jurnalisme", slug: "jurnalisme", count: 8 },
    { id: "2", name: "digital", slug: "digital", count: 5 },
    { id: "3", name: "investigasi", slug: "investigasi", count: 3 },
    { id: "4", name: "breaking news", slug: "breaking-news", count: 7 },
    { id: "5", name: "opini", slug: "opini", count: 4 },
    { id: "6", name: "wawancara", slug: "wawancara", count: 2 },
    { id: "7", name: "infografis", slug: "infografis", count: 6 },
    { id: "8", name: "video", slug: "video", count: 1 },
];

export default function TagsPage() {
    const [name, setName] = useState("");

    return (
        <div>
            <div className="page-header">
                <h1>Tags</h1>
            </div>

            <div className="split-view">
                {/* Add Form */}
                <div className="card">
                    <div className="card-header"><h2>Add New Tag</h2></div>
                    <div className="card-body">
                        <div className="split-form">
                            <div className="form-field">
                                <label>Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tag name" />
                            </div>
                            <div className="form-field">
                                <label>Slug</label>
                                <input type="text" value={name.toLowerCase().replace(/\s+/g, "-")} readOnly placeholder="auto-generated" />
                            </div>
                            <button className="btn btn-primary">Add New Tag</button>
                        </div>
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
                            {dummyTags.map((tag) => (
                                <tr key={tag.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>
                                        <span style={{ fontWeight: 500, color: "var(--admin-primary)" }}>{tag.name}</span>
                                        <div className="row-actions">
                                            <button>Edit</button>
                                            <span className="row-actions-sep">|</span>
                                            <button className="danger">Delete</button>
                                        </div>
                                    </td>
                                    <td>{tag.slug}</td>
                                    <td>{tag.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
