"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import {
    Mail,
    Globe,
    Twitter,
    Facebook,
    Instagram,
    Youtube,
    Github,
    Linkedin,
    Phone,
    Menu,
    ChevronRight,
    Search
} from "lucide-react";
import type { ComponentType } from "react";
import type { ThemeLayoutProps, ContactItem, MenuItem } from "@/lib/themes";

const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
    mail: Mail,
    globe: Globe,
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    github: Github,
    linkedin: Linkedin,
    phone: Phone,
};

// Helper component for dynamic logo formatting (bold first part, thin second part)
function SiteLogo({ title }: { title: string }) {
    if (!title) return <span className="font-black text-2xl text-white tracking-tighter">LOGO</span>;
    
    let parts = [];
    if (title.includes(".")) {
        parts = title.split(".");
    } else if (title.includes(" ")) {
        parts = title.split(" ");
    } else {
        // Just split half if no space or dot
        const half = Math.ceil(title.length / 2);
        parts = [title.slice(0, half), title.slice(half)];
    }

    const first = parts.shift()?.toUpperCase() || "";
    const rest = parts.join(title.includes(".") ? "." : " ").toUpperCase();

    return (
        <span className="font-black text-xl md:text-2xl text-white tracking-tighter group-hover:text-blue-400 transition-colors">
            {first}
            {rest && <span className="text-gray-500 font-light text-[0.9em] ml-0.5">{title.includes(".") ? "." : " "}{rest}</span>}
        </span>
    );
}

export default function ThemeLayout({
    children,
    siteTitle,
    siteTagline,
    contacts,
    primaryMenu,
    footerMenu,
    cacheId
}: ThemeLayoutProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/search/${encodeURIComponent(q)}`);
            setSearchQuery("");
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0B1120] font-sans text-gray-300 selection:bg-blue-500/30 selection:text-blue-200">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#0B1120]/90 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-1 group">
                        <SiteLogo title={siteTitle || "MERPATI.CMS"} />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
                        {primaryMenu.map((item: MenuItem) => (
                            <Link
                                key={item.id}
                                href={item.url || `/${item.slug || ""}`}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors uppercase tracking-wide"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block w-56 lg:w-64">
                            <form onSubmit={handleSearch}>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari artikel..." 
                                    className="w-full bg-[#1E293B] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
                                />
                            </form>
                        </div>
                        <button className="md:hidden p-2 -mr-2 text-gray-300 hover:text-white transition-colors">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full bg-[#0B1120]">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#050810] text-gray-300 py-16 border-t border-white/[0.05]">
                <div className="container mx-auto px-4 grid gap-12 md:grid-cols-3">
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <SiteLogo title={siteTitle || "MERPATI.CMS"} />
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
                            {siteTagline || "The Ultimate Serverless WordPress Alternative for Modern Publishers. Ringkas, Praktis, Aman."}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {contacts && contacts.map((contact: ContactItem) => {
                                const IconComp = ICON_MAP[contact.iconId] || Globe;
                                return (
                                    <a
                                        key={contact.id}
                                        href={contact.url}
                                        title={contact.title}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-full bg-[#1E293B] text-gray-400 hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"
                                    >
                                        <IconComp className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Navigasi Utama</h3>
                            <ul className="space-y-3">
                                {footerMenu.map((item: MenuItem) => (
                                    <li key={item.id}>
                                        <Link
                                            href={item.url || `/${item.slug || ""}`}
                                            className="text-sm hover:text-blue-400 text-gray-400 transition-colors inline-flex items-center gap-2 group"
                                        >
                                            <ChevronRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 transition-all -ml-2 group-hover:ml-0" />
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Sitemap & Info</h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/rss.xml" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                                        RSS Feed
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/sitemap.xml" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2">
                                        Sitemap XML
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p>© {new Date().getFullYear()} {siteTitle || "Merpati CMS"}. All rights reserved.</p>
                        {cacheId && (
                            <span className="text-[9px] opacity-40 font-mono tracking-widest uppercase" title="Visual indicator of Next.js Full Route Cache freshness">
                                CACHE ID: {cacheId}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
