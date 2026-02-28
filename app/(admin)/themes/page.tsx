"use client";

export default function ThemesPage() {
    return (
        <div>
            <div className="page-header">
                <h1>Themes</h1>
            </div>

            <div className="themes-grid">
                {/* Default Theme */}
                <div className="theme-card active">
                    <div className="theme-preview" style={{ background: "linear-gradient(135deg, #2271B1 0%, #135E96 100%)" }}>
                        🕊️
                    </div>
                    <div className="theme-info">
                        <div className="theme-name">Default</div>
                        <div className="theme-meta">v1.0.0 · Built-in</div>
                        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                            <span className="badge badge-published">✅ Active</span>
                            <button className="btn btn-secondary" style={{ fontSize: "12px", padding: "2px 8px" }}>Customize</button>
                        </div>
                    </div>
                </div>

                {/* Developer Dark */}
                <div className="theme-card">
                    <div className="theme-preview" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
                        🌙
                    </div>
                    <div className="theme-info">
                        <div className="theme-name">Developer Dark</div>
                        <div className="theme-meta">v1.0.0 · Child of Default</div>
                        <div style={{ marginTop: "8px" }}>
                            <button className="btn btn-primary" style={{ fontSize: "12px", padding: "4px 12px" }}>Activate</button>
                        </div>
                    </div>
                </div>

                {/* Minimalist */}
                <div className="theme-card">
                    <div className="theme-preview" style={{ background: "linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)", color: "#1A1A1A" }}>
                        ✨
                    </div>
                    <div className="theme-info">
                        <div className="theme-name">Minimalist</div>
                        <div className="theme-meta">v1.0.0 · Child of Default</div>
                        <div style={{ marginTop: "8px" }}>
                            <button className="btn btn-primary" style={{ fontSize: "12px", padding: "4px 12px" }}>Activate</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
