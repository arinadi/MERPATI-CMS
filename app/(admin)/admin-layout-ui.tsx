/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./admin.css";

const navItems = [
    { href: "/dashboard", icon: "📊", label: "Dashboard" },
    { href: "/posts", icon: "📝", label: "Posts" },
    { href: "/media", icon: "📷", label: "Media" },
    { href: "/pages-manage", icon: "📄", label: "Pages" },
    { href: "/categories", icon: "🏷️", label: "Categories" },
    { href: "/tags", icon: "🔖", label: "Tags" },
    { href: "/themes", icon: "🎨", label: "Themes" },
    { href: "/users", icon: "👤", label: "Users" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
];

export default function AdminLayoutUI({ children, user }: { children: React.ReactNode, user: { name?: string | null, email?: string | null, image?: string | null, role?: string } }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-wrapper">
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-logo">
                    <Link href="/dashboard">
                        🕊️ <span>MERPATI</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        // Kalau bukan super_user, sembunyikan Users dan Settings dan Themes
                        if (user.role !== "super_user" && ["/users", "/settings", "/themes"].includes(item.href)) {
                            return null;
                        }
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-item ${pathname.startsWith(item.href) ? "active" : ""}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">v0.1.0</div>
            </aside>

            {/* Main Content */}
            <div className="main-area">
                {/* Top Bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="hamburger"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle menu"
                        >
                            ☰
                        </button>
                        <Link href="/">🏠 Visit Site</Link>
                    </div>
                    <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link href="/profile">
                            <span className="topbar-user" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {user.image ? (
                                    <img src={user.image} alt={user.name || "User"} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                                ) : (
                                    <span className="topbar-avatar">{user.name?.charAt(0) || "U"}</span>
                                )}
                                <span>{user.name}</span>
                            </span>
                        </Link>
                        <button
                            onClick={() => {
                                import("../actions/auth").then(m => m.logout());
                            }}
                            style={{ padding: "6px 12px", background: "none", border: "1px solid var(--admin-border)", color: "var(--admin-text-muted)", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
