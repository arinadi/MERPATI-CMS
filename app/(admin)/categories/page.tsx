"use client";

import { useState } from "react";

const dummyCategories = [
    { id: "1", name: "Politik", slug: "politik", parent: null, count: 5 },
    { id: "2", name: "Ekonomi", slug: "ekonomi", parent: null, count: 3 },
    { id: "3", name: "Makro", slug: "makro", parent: "Ekonomi", count: 1 },
    { id: "4", name: "Teknologi", slug: "teknologi", parent: null, count: 4 },
    { id: "5", name: "Pendidikan", slug: "pendidikan", parent: null, count: 2 },
    { id: "6", name: "Olahraga", slug: "olahraga", parent: null, count: 3 },
    { id: "7", name: "Budaya", slug: "budaya", parent: null, count: 2 },
    { id: "8", name: "Lingkungan", slug: "lingkungan", parent: null, count: 1 },
];

export default function CategoriesPage() {
    const [name, setName] = useState("");

    return (
        <div>
            <div className="page-header">
                <h1>Categories</h1>
            </div>

            <div className="split-view">
                {/* Add Form */}
                <div className="card">
                    <div className="card-header"><h2>Add New Category</h2></div>
                    <div className="card-body">
                        <div className="split-form">
                            <div className="form-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Category name"
                                />
                            </div>
                            <div className="form-field">
                                <label>Slug</label>
                                <input
                                    type="text"
                                    value={name.toLowerCase().replace(/\s+/g, "-")}
                                    readOnly
                                    placeholder="auto-generated"
                                />
                            </div>
                            <div className="form-field">
                                <label>Parent Category</label>
                                <select>
                                    <option value="">— None —</option>
                                    {dummyCategories.filter(c => !c.parent).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Description</label>
                                <textarea rows={3} placeholder="Optional description..." />
                            </div>
                            <button className="btn btn-primary">Add New Category</button>
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
                            {dummyCategories.map((cat) => (
                                <tr key={cat.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>
                                        <div>
                                            <span style={{ fontWeight: 500, color: "var(--admin-primary)" }}>
                                                {cat.parent ? "— " : ""}{cat.name}
                                            </span>
                                        </div>
                                        <div className="row-actions">
                                            <button>Edit</button>
                                            <span className="row-actions-sep">|</span>
                                            <button className="danger">Delete</button>
                                        </div>
                                    </td>
                                    <td>{cat.slug}</td>
                                    <td>{cat.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
