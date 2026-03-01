"use client";

import Link from "next/link";
import { useState, useRef, useTransition, useEffect } from "react";
import { savePost } from "@/app/actions/posts";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditorClient({ initialData = {} }: { initialData?: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [title, setTitle] = useState(initialData.title || "");
    const [slug, setSlug] = useState(initialData.slug || "");
    const [htmlMode, setHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState(initialData.content || "");
    const [excerpt, setExcerpt] = useState(initialData.excerpt || "");
    const [status] = useState(initialData.status || "draft");
    const [metaTitle, setMetaTitle] = useState(initialData.metaTitle || "");
    const [metaDescription, setMetaDescription] = useState(initialData.metaDescription || "");

    const contentRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Initialize wysiwyg content if edit mode
    useEffect(() => {
        if (contentRef.current && initialData.content && !htmlMode) {
            contentRef.current.innerHTML = initialData.content;
        }
    }, [initialData.content, htmlMode]);

    const handleSave = (saveStatus: "draft" | "published") => {
        if (!title.trim()) {
            alert("Title is required!");
            return;
        }

        const formData = new FormData(formRef.current!);
        formData.append("status", saveStatus);
        formData.append("type", initialData.type || "post");

        // Grab content from either WYSIWYG or HTML textarea
        const finalContent = htmlMode
            ? htmlContent
            : (contentRef.current?.innerHTML || "");

        formData.append("content", finalContent);
        if (slug) formData.append("slug", slug);

        startTransition(async () => {
            const result = await savePost(initialData.id || null, formData);
            if (result && "error" in result && result.error) {
                alert(result.error);
            } else if (result && "success" in result) {
                if (!initialData.id) {
                    router.push(`/posts/${result.id}/edit`);
                } else {
                    alert("Post saved successfully!");
                }
            }
        });
    };

    return (
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <div className="page-header">
                <h1>{initialData.id ? "Edit Post" : "Add New Post"}</h1>
                {initialData.id && (
                    <Link href={`/${initialData.slug}`} target="_blank" className="btn btn-secondary">
                        View Post
                    </Link>
                )}
            </div>

            <div className="editor-layout">
                {/* Main Editor */}
                <div className="editor-main">
                    {/* Title */}
                    <input
                        type="text"
                        name="title"
                        className="editor-title-input"
                        placeholder="Enter title here"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isPending}
                        required
                    />

                    {/* Permalink */}
                    {title && (
                        <div className="permalink-row">
                            Permalink: <span>site.com/</span>
                            <input
                                type="text"
                                value={slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}
                                onChange={(e) => setSlug(e.target.value)}
                                style={{ border: "1px solid #ccc", padding: "2px 4px", borderRadius: "3px" }}
                                disabled={isPending}
                            />
                        </div>
                    )}

                    {/* Toolbar */}
                    <div>
                        <div className="editor-toolbar">
                            <button type="button" className="toolbar-btn" title="Bold" onClick={() => document.execCommand('bold')}><b>B</b></button>
                            <button type="button" className="toolbar-btn" title="Italic" onClick={() => document.execCommand('italic')}><i>I</i></button>
                            <div className="toolbar-sep" />
                            <div style={{ marginLeft: "auto" }}>
                                <button
                                    type="button"
                                    className={`toolbar-btn ${htmlMode ? "active" : ""}`}
                                    onClick={() => {
                                        if (htmlMode) {
                                            if (contentRef.current) contentRef.current.innerHTML = htmlContent;
                                        } else {
                                            setHtmlContent(contentRef.current?.innerHTML || "");
                                        }
                                        setHtmlMode(!htmlMode);
                                    }}
                                    title="HTML Mode"
                                >
                                    &lt;/&gt;
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        {htmlMode ? (
                            <textarea
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
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
                                disabled={isPending}
                            />
                        ) : (
                            <div
                                ref={contentRef}
                                className="editor-content"
                                contentEditable={!isPending}
                                suppressContentEditableWarning
                            />
                        )}
                    </div>

                    {/* Excerpt */}
                    <div className="card" style={{ marginTop: "20px" }}>
                        <div className="card-header"><h2>Excerpt</h2></div>
                        <div className="card-body">
                            <textarea
                                name="excerpt"
                                className="excerpt-textarea"
                                placeholder="Write a short summary for SEO and post cards..."
                                disabled={isPending}
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="editor-sidebar">
                    {/* Publish Box */}
                    <div className="meta-box">
                        <div className="meta-box-header">Publish</div>
                        <div className="meta-box-body">
                            <div className="publish-actions">
                                <div className="publish-status" style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
                                    <span>Status: <b>{status.charAt(0).toUpperCase() + status.slice(1)}</b></span>
                                </div>
                                <div className="publish-buttons">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={() => handleSave("draft")}
                                        disabled={isPending}
                                    >
                                        Save Draft
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ width: "100%" }}
                                    onClick={() => handleSave("published")}
                                    disabled={isPending}
                                >
                                    {isPending ? "Saving..." : (status === "published" || initialData.id ? "Update" : "Publish")}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="meta-box">
                        <div className="meta-box-header">SEO</div>
                        <div className="meta-box-body">
                            <div className="seo-field">
                                <label>SEO Title</label>
                                <input type="text" name="metaTitle" placeholder={title || "Post title"} disabled={isPending} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                            </div>
                            <div className="seo-field">
                                <label>Meta Description</label>
                                <textarea name="metaDescription" rows={3} placeholder="Write a compelling description (max 160 chars)..." disabled={isPending} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
