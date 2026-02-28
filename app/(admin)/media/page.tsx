"use client";

import { useState } from "react";

const dummyMedia = [
    { id: "1", filename: "hero-banner.jpg", size: "245 KB", date: "28 Feb 2026", type: "image/jpeg" },
    { id: "2", filename: "presiden-meeting.png", size: "1.2 MB", date: "27 Feb 2026", type: "image/png" },
    { id: "3", filename: "infografis-ekonomi.jpg", size: "890 KB", date: "26 Feb 2026", type: "image/jpeg" },
    { id: "4", filename: "logo-merpati.svg", size: "12 KB", date: "25 Feb 2026", type: "image/svg+xml" },
    { id: "5", filename: "wawancara-menteri.jpg", size: "456 KB", date: "24 Feb 2026", type: "image/jpeg" },
    { id: "6", filename: "stadion-aerial.jpg", size: "2.1 MB", date: "23 Feb 2026", type: "image/jpeg" },
    { id: "7", filename: "batik-festival.jpg", size: "678 KB", date: "22 Feb 2026", type: "image/jpeg" },
    { id: "8", filename: "tech-review.png", size: "345 KB", date: "21 Feb 2026", type: "image/png" },
];

const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a", "#a18cd1", "#fbc2eb"];

export default function MediaPage() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div>
            <div className="page-header">
                <h1>Media Library</h1>
                <button className="btn btn-primary">📤 Upload New</button>
            </div>

            {/* Dropzone */}
            <div className="dropzone">
                <div className="dropzone-icon">📁</div>
                <div className="dropzone-text">Drag images here or click to upload</div>
                <div className="dropzone-hint">Max file size: 4.5 MB • JPG, PNG, GIF, WebP, SVG</div>
            </div>

            {/* Grid */}
            <div className="media-grid">
                {dummyMedia.map((item, i) => (
                    <div
                        key={item.id}
                        className={`media-card ${selected === item.id ? "selected" : ""}`}
                        onClick={() => setSelected(selected === item.id ? null : item.id)}
                    >
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
                            🖼
                        </div>
                        <div className="media-info">
                            <div className="media-filename">{item.filename}</div>
                            <div className="media-size">{item.size}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Panel */}
            {selected && (() => {
                const item = dummyMedia.find(m => m.id === selected)!;
                return (
                    <div className="media-detail">
                        <button className="media-detail-close" onClick={() => setSelected(null)}>×</button>
                        <div style={{
                            width: "100%",
                            aspectRatio: "16/9",
                            background: `linear-gradient(135deg, ${colors[parseInt(item.id) % colors.length]}, ${colors[(parseInt(item.id) + 3) % colors.length]})`,
                            borderRadius: "4px",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "32px",
                        }}>🖼</div>
                        <h3 style={{ marginBottom: "16px" }}>{item.filename}</h3>
                        <div className="form-field">
                            <label>File URL</label>
                            <div style={{ display: "flex", gap: "4px" }}>
                                <input type="text" readOnly value={`https://blob.vercel-storage.com/${item.filename}`} style={{ flex: 1, padding: "6px 8px", border: "1px solid var(--admin-border)", borderRadius: "3px", fontSize: "12px" }} />
                                <button className="btn btn-secondary">Copy</button>
                            </div>
                        </div>
                        <div className="form-field">
                            <label>Alt Text</label>
                            <input type="text" placeholder="Describe this image..." style={{ width: "100%", padding: "6px 8px", border: "1px solid var(--admin-border)", borderRadius: "3px" }} />
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--admin-text-muted)", display: "flex", flexDirection: "column", gap: "4px", marginTop: "12px" }}>
                            <div><b>Type:</b> {item.type}</div>
                            <div><b>Size:</b> {item.size}</div>
                            <div><b>Uploaded:</b> {item.date}</div>
                            <div><b>Uploaded by:</b> Rina Sari</div>
                        </div>
                        <button className="btn btn-danger" style={{ width: "100%", marginTop: "20px" }}>🗑 Delete Permanently</button>
                    </div>
                );
            })()}
        </div>
    );
}
