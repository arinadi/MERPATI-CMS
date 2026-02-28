"use client";

import Link from "next/link";
import { useState } from "react";

const dummyCategories = [
    { id: "1", name: "Politik", checked: false },
    { id: "2", name: "Ekonomi", checked: false },
    { id: "3", name: "Teknologi", checked: true },
    { id: "4", name: "Pendidikan", checked: false },
    { id: "5", name: "Olahraga", checked: false },
    { id: "6", name: "Budaya", checked: false },
];

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    const [tags, setTags] = useState(["jurnalisme", "digital"]);
    const [tagInput, setTagInput] = useState("");
    const [hasFeaturedImage, setHasFeaturedImage] = useState(false);
    const [htmlMode, setHtmlMode] = useState(false);

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
            setTags([...tags, tagInput.trim().toLowerCase()]);
            setTagInput("");
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Add New Post</h1>
            </div>

            <div className="editor-layout">
                {/* Main Editor */}
                <div className="editor-main">
                    {/* Title */}
                    <input
                        type="text"
                        className="editor-title-input"
                        placeholder="Enter title here"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Permalink */}
                    {title && (
                        <div className="permalink-row">
                            Permalink: <span>site.com/{title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")}</span>
                            <button className="permalink-edit">Edit</button>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div>
                        <div className="editor-toolbar">
                            <button className="toolbar-btn" title="Bold"><b>B</b></button>
                            <button className="toolbar-btn" title="Italic"><i>I</i></button>
                            <button className="toolbar-btn" title="Strikethrough"><s>S</s></button>
                            <button className="toolbar-btn" title="Blockquote">&ldquo;</button>
                            <div className="toolbar-sep" />
                            <select className="toolbar-select" title="Heading">
                                <option>Paragraph</option>
                                <option>Heading 2</option>
                                <option>Heading 3</option>
                                <option>Heading 4</option>
                            </select>
                            <div className="toolbar-sep" />
                            <button className="toolbar-btn" title="Unordered List">☰</button>
                            <button className="toolbar-btn" title="Ordered List">1.</button>
                            <div className="toolbar-sep" />
                            <button className="toolbar-btn" title="Align Left">≡</button>
                            <button className="toolbar-btn" title="Align Center">≡</button>
                            <button className="toolbar-btn" title="Align Right">≡</button>
                            <div className="toolbar-sep" />
                            <button className="toolbar-btn" title="Insert Link">🔗</button>
                            <button className="toolbar-btn" title="Insert Media">📷</button>
                            <button className="toolbar-btn" title="More options">⋯</button>
                            <div style={{ marginLeft: "auto" }}>
                                <button
                                    className={`toolbar-btn ${htmlMode ? "active" : ""}`}
                                    onClick={() => setHtmlMode(!htmlMode)}
                                    title="HTML Mode"
                                >
                                    &lt;/&gt;
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {htmlMode ? (
                            <textarea
                                style={{
                                    width: "100%",
                                    minHeight: "400px",
                                    padding: "16px",
                                    border: "1px solid var(--admin-border)",
                                    borderTop: "none",
                                    borderRadius: "0 0 3px 3px",
                                    fontFamily: "monospace",
                                    fontSize: "14px",
                                    resize: "vertical",
                                }}
                                placeholder="<p>Write HTML here...</p>"
                            />
                        ) : (
                            <div
                                className="editor-content"
                                contentEditable
                                suppressContentEditableWarning
                            />
                        )}
                    </div>

                    {/* Status Bar */}
                    <div className="editor-status">
                        <span>Word count: 0</span>
                        <span>Draft saved</span>
                    </div>

                    {/* Excerpt */}
                    <div className="card">
                        <div className="card-header"><h2>Excerpt</h2></div>
                        <div className="card-body">
                            <textarea
                                className="excerpt-textarea"
                                placeholder="Write a short summary for SEO and post cards..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="editor-sidebar">
                    {/* Publish Box */}
                    <div className="meta-box">
                        <div className="meta-box-header">
                            Publish <span className="toggle">▼</span>
                        </div>
                        <div className="meta-box-body">
                            <div className="publish-actions">
                                <div className="publish-status">
                                    <span>Status: <b>Draft</b></span>
                                    <button className="permalink-edit">Edit</button>
                                </div>
                                <div className="publish-status">
                                    <span>Visibility: <b>Public</b></span>
                                </div>
                                <div className="publish-buttons">
                                    <button className="btn btn-secondary" style={{ flex: 1 }}>Save Draft</button>
                                    <button className="btn btn-secondary">👁 Preview</button>
                                </div>
                                <button className="btn btn-primary" style={{ width: "100%" }}>
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="meta-box">
                        <div className="meta-box-header">
                            Categories <span className="toggle">▼</span>
                        </div>
                        <div className="meta-box-body">
                            <ul className="category-list">
                                {dummyCategories.map((cat) => (
                                    <li key={cat.id} className="category-item">
                                        <input type="checkbox" defaultChecked={cat.checked} id={`cat-${cat.id}`} />
                                        <label htmlFor={`cat-${cat.id}`}>{cat.name}</label>
                                    </li>
                                ))}
                            </ul>
                            <button className="permalink-edit">+ Add New Category</button>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="meta-box">
                        <div className="meta-box-header">
                            Tags <span className="toggle">▼</span>
                        </div>
                        <div className="meta-box-body">
                            <div className="tag-chips">
                                {tags.map((tag) => (
                                    <span key={tag} className="tag-chip">
                                        {tag}
                                        <button
                                            className="tag-chip-remove"
                                            onClick={() => setTags(tags.filter(t => t !== tag))}
                                        >×</button>
                                    </span>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: "4px" }}>
                                <input
                                    type="text"
                                    className="tag-input"
                                    placeholder="Add tag..."
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                />
                                <button className="btn btn-secondary" onClick={addTag}>Add</button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="meta-box">
                        <div className="meta-box-header">
                            Featured Image <span className="toggle">▼</span>
                        </div>
                        <div className="meta-box-body">
                            {hasFeaturedImage ? (
                                <div className="featured-image-preview">
                                    <div style={{
                                        width: "100%",
                                        aspectRatio: "16/9",
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        borderRadius: "4px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#fff",
                                        fontSize: "14px",
                                    }}>
                                        Featured Image Preview
                                    </div>
                                    <button
                                        className="featured-image-remove"
                                        onClick={() => setHasFeaturedImage(false)}
                                    >×</button>
                                </div>
                            ) : (
                                <div
                                    className="featured-image-placeholder"
                                    onClick={() => setHasFeaturedImage(true)}
                                >
                                    📷 Set Featured Image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="meta-box">
                        <div className="meta-box-header">
                            SEO <span className="toggle">▼</span>
                        </div>
                        <div className="meta-box-body">
                            <div className="seo-field">
                                <label>SEO Title</label>
                                <input type="text" placeholder={title || "Post title"} />
                            </div>
                            <div className="seo-field">
                                <label>Meta Description</label>
                                <textarea rows={3} placeholder="Write a compelling description (max 160 chars)..." />
                            </div>
                            <div className="seo-field">
                                <label>Canonical URL</label>
                                <input type="url" placeholder="https://..." />
                            </div>
                            <div className="seo-field">
                                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                                    <input type="checkbox" defaultChecked /> Indexable (allow search engines)
                                </label>
                            </div>

                            {/* Google Preview */}
                            <div className="seo-preview">
                                <div className="seo-preview-google">
                                    <div className="url">site.com › post-slug</div>
                                    <div className="title">{title || "Post Title"} — MERPATI-CMS</div>
                                    <div className="desc">Your meta description will appear here. Make it compelling to improve click-through rate...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
