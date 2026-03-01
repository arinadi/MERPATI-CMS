"use client";

import { useState, useTransition, useRef } from "react";
import { uploadMedia, deleteMedia } from "@/app/actions/media";
import { formatDate } from "@/lib/utils";

type MediaItem = {
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    createdAt: Date;
    authorName: string | null;
};

const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a", "#a18cd1", "#fbc2eb"];

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            startTransition(async () => {
                const result = await uploadMedia(formData);
                if (result && "error" in result && result.error) {
                    alert(result.error);
                }
            });
            // reset input
            e.target.value = "";
        }
    };

    const handleDelete = async (id: string, url: string) => {
        if (confirm("Are you sure you want to permanently delete this file?")) {
            startTransition(async () => {
                const result = await deleteMedia(id, url);
                if (result && "error" in result && result.error) {
                    alert(result.error);
                } else {
                    setSelected(null);
                }
            });
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Media Library</h1>
                <button className="btn btn-primary" onClick={handleUploadClick} disabled={isPending}>
                    {isPending ? "Uploading..." : "📤 Upload New"}
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*,video/*,application/pdf"
                />
            </div>

            {/* Dropzone */}
            <div className="dropzone" onClick={handleUploadClick} style={{ cursor: "pointer", opacity: isPending ? 0.6 : 1 }}>
                <div className="dropzone-icon">📁</div>
                <div className="dropzone-text">Drag images here or click to upload</div>
                <div className="dropzone-hint">Max file size: 4.5 MB • JPG, PNG, GIF, WebP, SVG</div>
            </div>

            {/* Grid */}
            <div className="media-grid">
                {initialMedia.length === 0 && (
                    <div style={{ padding: "40px", color: "var(--admin-text-muted)" }}>No media found.</div>
                )}
                {initialMedia.map((item, i) => (
                    <div
                        key={item.id}
                        className={`media-card ${selected === item.id ? "selected" : ""}`}
                        onClick={() => setSelected(selected === item.id ? null : item.id)}
                        style={{ opacity: isPending && selected === item.id ? 0.5 : 1 }}
                    >
                        {item.mimeType.startsWith("image/") ? (
                            <div
                                className="media-thumb"
                                style={{
                                    backgroundImage: `url(${item.url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />
                        ) : (
                            <div
                                className="media-thumb"
                                style={{
                                    background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 3) % colors.length]})`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: "24px",
                                }}
                            >
                                📄
                            </div>
                        )}
                        <div className="media-info">
                            <div className="media-filename">{item.filename}</div>
                            <div className="media-size">{formatBytes(item.size)}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Panel */}
            {selected && (() => {
                const item = initialMedia.find(m => m.id === selected);
                if (!item) return null;

                return (
                    <div className="media-detail">
                        <button className="media-detail-close" onClick={() => setSelected(null)}>×</button>

                        {item.mimeType.startsWith("image/") ? (
                            <a href={item.url} target="_blank">
                                <div style={{
                                    width: "100%",
                                    aspectRatio: "16/9",
                                    backgroundImage: `url(${item.url})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "4px",
                                    marginBottom: "16px",
                                    backgroundColor: "#eee"
                                }} />
                            </a>
                        ) : (
                            <div style={{
                                width: "100%",
                                aspectRatio: "16/9",
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                borderRadius: "4px",
                                marginBottom: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "32px",
                            }}>📄</div>
                        )}

                        <h3 style={{ marginBottom: "16px", wordBreak: "break-all" }}>{item.filename}</h3>
                        <div className="form-field">
                            <label>File URL</label>
                            <div style={{ display: "flex", gap: "4px" }}>
                                <input type="text" readOnly value={item.url} style={{ flex: 1, padding: "6px 8px", border: "1px solid var(--admin-border)", borderRadius: "3px", fontSize: "12px" }} />
                                <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(item.url)}>Copy</button>
                            </div>
                        </div>
                        <div className="form-field">
                            <label>Alt Text</label>
                            <input type="text" placeholder="Describe this image..." style={{ width: "100%", padding: "6px 8px", border: "1px solid var(--admin-border)", borderRadius: "3px" }} />
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--admin-text-muted)", display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                            <div><b>Type:</b> {item.mimeType}</div>
                            <div><b>Size:</b> {formatBytes(item.size)}</div>
                            <div><b>Uploaded:</b> {formatDate(item.createdAt)}</div>
                            <div><b>Uploaded by:</b> {item.authorName || "Unknown"}</div>
                        </div>
                        <button
                            className="btn btn-danger"
                            style={{ width: "100%", marginTop: "20px" }}
                            onClick={() => handleDelete(item.id, item.url)}
                            disabled={isPending}
                        >
                            🗑 Delete Permanently
                        </button>
                    </div>
                );
            })()}
        </div>
    );
}
