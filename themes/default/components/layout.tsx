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

export default function ThemeLayout({
    children,
    siteTitle,
    siteTagline,
    contacts,
    primaryMenu,
    footerMenu
}: ThemeLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            {siteTitle.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight tracking-tight">{siteTitle}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{siteTagline}</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-8">
                        {primaryMenu.map((item: MenuItem) => (
                            <Link
                                key={item.id}
                                href={item.url || `/${item.slug || ""}`}
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block">
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="md:hidden p-2 -mr-2">
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
                <div className="container mx-auto px-4 grid gap-12 md:grid-cols-3">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {siteTitle.charAt(0)}
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">{siteTitle}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                            {siteTagline}. Media Editorial Ringkas, Praktis, Aman, Tetap Independen.
                        </p>
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
                                        className="p-2 rounded-full bg-slate-800 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1"
                                    >
                                        <IconComp className="w-4 h-4" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Navigasi</h3>
                            <ul className="space-y-3">
                                {footerMenu.map((item: MenuItem) => (
                                    <li key={item.id}>
                                        <Link
                                            href={item.url || `/${item.slug || ""}`}
                                            className="text-sm hover:text-indigo-400 transition-colors inline-flex items-center gap-2"
                                        >
                                            <ChevronRight className="w-3 h-3 opacity-50" />
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Sitemap</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/about" className="hover:text-indigo-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</Link></li>
                                <li><Link href="/rss" className="hover:text-indigo-400 transition-colors">RSS Feed</Link></li>
                                <li><Link href="/sitemap.xml" className="hover:text-indigo-400 transition-colors">Sitemap XML</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-slate-500">
                    <p>© {new Date().getFullYear()} {siteTitle}. Dikembangkan dengan MERPATI CMS.</p>
                    <p>Kebebasan pers dimulai dari kemandirian infrastrukturnya.</p>
                </div>
            </footer>
        </div>
    );
}
