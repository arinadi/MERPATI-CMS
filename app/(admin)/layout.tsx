"use client";

import Link from "next/link";

const navItems = [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/posts", icon: "📝", label: "Posts" },
    { href: "/media", icon: "📷", label: "Media" },
    { href: "/pages", icon: "📄", label: "Pages" },
    { href: "/categories", icon: "🏷️", label: "Categories" },
    { href: "/tags", icon: "🏷️", label: "Tags" },
    { href: "/themes", icon: "🎨", label: "Themes" },
    { href: "/users", icon: "👤", label: "Users" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside style={{
                width: "var(--sidebar-width)",
                background: "var(--admin-sidebar-bg)",
                color: "var(--admin-sidebar-text)",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
                overflowY: "auto",
            }}>
                {/* Logo */}
                <div style={{
                    padding: "16px 12px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}>
                    <Link href="/dashboard" style={{
                        color: "#fff",
                        textDecoration: "none",
                        fontSize: "15px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}>
                        🕊️ MERPATI
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: "8px 0" }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                color: "var(--admin-sidebar-text)",
                                textDecoration: "none",
                                fontSize: "13px",
                                transition: "background 150ms ease, color 150ms ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "var(--admin-sidebar-hover)";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "var(--admin-sidebar-text)";
                            }}
                        >
                            <span style={{ fontSize: "16px" }}>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: "var(--sidebar-width)",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Top Bar */}
                <header style={{
                    height: "var(--topbar-height)",
                    background: "var(--admin-topbar-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    position: "sticky",
                    top: 0,
                    zIndex: 99,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link href="/" style={{ color: "var(--admin-sidebar-text)", fontSize: "12px", textDecoration: "none" }}>
                            🏠 Visit Site
                        </Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--admin-sidebar-text)", fontSize: "12px" }}>
                            👤 Admin User
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, padding: "20px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
