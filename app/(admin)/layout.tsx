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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname.startsWith(item.href) ? "active" : ""}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
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
                    <div className="topbar-right">
                        <Link href="/profile">
                            <span className="topbar-user">
                                <span className="topbar-avatar">A</span>
                                Admin User
                            </span>
                        </Link>
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
