"use client";

import "../theme.css";

import { SafeImage } from "@/components/ui/safe-image";
import { useState, useEffect } from "react";
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

function SiteLogo({ title, logoUrl }: { title: string; logoUrl?: string }) {
    if (logoUrl) {
        return (
            <div className="flex items-center gap-3 group">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00e5b7]" />
                <SafeImage 
                    src={logoUrl} 
                    alt={title || "Site Logo"} 
                    width={150} 
                    height={40} 
                    className="h-7 w-auto object-contain"
                />
            </div>
        );
    }

    if (!title) return <span className="font-bold text-lg text-white">LOGO</span>;
    
    let parts = [];
    if (title.includes(".")) {
        parts = title.split(".");
    } else if (title.includes(" ")) {
        parts = title.split(" ");
    } else {
        const half = Math.ceil(title.length / 2);
        parts = [title.slice(0, half), title.slice(half)];
    }

    const first = parts.shift() || "";
    const separator = title.includes(".") ? "." : (title.includes(" ") ? " " : "");
    const rest = parts.join(separator);

    return (
        <div className="flex items-center gap-3 group">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00e5b7]" />
            <span className="text-lg tracking-tight group-hover:opacity-80 transition-opacity">
                <span className="font-bold text-white">{first}</span>
                {rest && (
                    <span className="font-light text-zinc-400">{separator}{rest}</span>
                )}
            </span>
        </div>
    );
}

export default function ThemeLayout({
    children,
    siteTitle,
    siteTagline,
    siteLogo,
    contacts,
    primaryMenu,
    footerMenu,
    cacheId
}: ThemeLayoutProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/search/${encodeURIComponent(q)}`);
            setSearchQuery("");
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#09090b] font-sans text-gray-300 selection:bg-blue-500/30 selection:text-blue-200">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#09090b]/90 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <SiteLogo title={siteTitle || "arinano.work"} logoUrl={siteLogo} />
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
                        {primaryMenu.map((item: MenuItem) => (
                            <Link
                                key={item.id}
                                href={item.url || `/${item.slug || ""}`}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                /{item.title.toLowerCase()}
                            </Link>
                        ))}
                    </nav>

                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <nav className="absolute top-0 right-0 w-[80%] max-w-sm h-full bg-[#111113] border-l border-white/10 shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                            <SiteLogo title={siteTitle || "arinano.work"} logoUrl={siteLogo} />
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                aria-label="Close menu"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-5 py-4 border-b border-white/10">
                            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }}>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="w-full bg-zinc-900 border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00e5b7] font-mono"
                                    />
                                </div>
                            </form>
                        </div>
                        <ul className="flex-1 overflow-y-auto py-4 px-5 space-y-1">
                            {primaryMenu.map((item: MenuItem) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.url || `/${item.slug || ""}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-mono"
                                    >
                                        <ChevronRight className="w-4 h-4 text-[#00e5b7]" />
                                        /{item.title.toLowerCase()}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {contacts && contacts.length > 0 && (
                            <div className="p-5 border-t border-white/10">
                                <div className="flex flex-wrap gap-3">
                                    {contacts.map((contact: ContactItem) => {
                                        const IconComp = ICON_MAP[contact.iconId] || Globe;
                                        return (
                                            <a
                                                key={contact.id}
                                                href={contact.url}
                                                title={contact.title}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 rounded-full bg-zinc-900 text-gray-400 hover:bg-[#00e5b7] hover:text-black transition-all shadow-sm"
                                            >
                                                <IconComp className="w-4 h-4" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full bg-[#09090b]">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#050810] text-gray-300 py-16 border-t border-white/[0.05]">
                <div className="container mx-auto px-4 grid gap-12 md:grid-cols-3">
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <SiteLogo title={siteTitle || "MERPATI.CMS"} logoUrl={siteLogo} />
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
