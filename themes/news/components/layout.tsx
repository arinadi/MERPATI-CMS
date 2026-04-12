"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/safe-image';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube, 
  Edit, 
  X,
  Phone
} from 'lucide-react';
import type { ThemeLayoutProps } from '@/lib/themes';
import { getDefault } from '../options';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram size={16} />,
  twitter: <Twitter size={16} />,
  x: <Twitter size={16} />,
  facebook: <Facebook size={16} />,
  youtube: <Youtube size={16} />,
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
  ),
  phone: <Phone size={16} />,
  whatsapp: <Phone size={16} />
};

const SOCIAL_COLORS: Record<string, string> = {
  instagram: "bg-[#E1306C]",
  twitter: "bg-black",
  x: "bg-black",
  facebook: "bg-[#1877F2]",
  youtube: "bg-[#FF0000]",
  tiktok: "bg-black",
  phone: "bg-green-600",
  whatsapp: "bg-green-500"
};

function resolveMenuUrl(item: { url: string | null; slug?: string; type: string }): string {
  if (item.url) return item.url;
  if (item.slug) return `/${item.slug}`;
  return "/";
}

export default function ThemeLayout({
  children,
  siteTitle,
  siteTagline,
  siteLogo,
  contacts,
  primaryMenu,
  footerMenu,
  cacheId,
  themeOptions
}: ThemeLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const primaryColor = (themeOptions?.theme_news_primary_color as string) || getDefault("theme_news_primary_color") as string;
  const accentColor = (themeOptions?.theme_news_accent_color as string) || getDefault("theme_news_accent_color") as string;
  const ctaColor = (themeOptions?.theme_news_cta_color as string) || getDefault("theme_news_cta_color") as string || "#3A9D36";
  const ctaText = (themeOptions?.theme_news_cta_text as string) || getDefault("theme_news_cta_text") as string;
  const ctaUrl = (themeOptions?.theme_news_cta_url as string) || "#";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search/${encodeURIComponent(q)}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  }

  // Helper to chunk footer menu items if needed (mockup had 3 columns, we'll divide footerMenu)
  const menuChunks = [];
  for (let i = 0; i < footerMenu.length; i += 4) {
      menuChunks.push(footerMenu.slice(i, i + 4));
  }

  return (
    <div 
      className="min-h-screen bg-white font-sans text-gray-900 flex flex-col"
      style={{
        '--news-primary': primaryColor,
        '--news-accent': accentColor,
      } as React.CSSProperties}
    >
      <header className="text-white sticky top-0 z-50 transition-colors" style={{ backgroundColor: primaryColor }}>
        {/* Top Bar */}
        <div className="container mx-auto px-4 py-2.5 md:py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {siteLogo ? (
              <SafeImage
                src={siteLogo}
                alt={siteTitle}
                width={200}
                height={50}
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
            ) : (
              <div className="font-black text-3xl italic tracking-tighter flex items-center transition-colors" style={{ color: accentColor }}>
                <span className="text-white mr-1 group-hover:animate-pulse">⚡</span>
                {siteTitle.toUpperCase()}
                <span className="text-white ml-1 group-hover:animate-pulse">⚡</span>
              </div>
            )}
          </Link>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href={ctaUrl} className="transition-colors text-white px-4 py-2 rounded font-bold flex items-center gap-2 text-sm hover:opacity-90" style={{ backgroundColor: ctaColor }}>
              <Edit size={16} /> {ctaText}
            </Link>
            <div className="w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-3">
              {contacts.map((contact) => {
                const iconName = contact.iconId.toLowerCase();
                const bgColorClass = SOCIAL_COLORS[iconName] || "bg-gray-600";
                return (
                  <a key={contact.id} href={contact.url} target="_blank" rel="noopener noreferrer" className={`${bgColorClass} p-1.5 rounded-full hover:opacity-80 transition-opacity`} aria-label={contact.title}>
                    {SOCIAL_ICONS[iconName] || <Link className="w-4 h-4" href={contact.url} />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="border-t border-gray-700 hidden lg:block" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <div className="container mx-auto px-4 flex justify-between items-center py-2 md:py-3">
            <nav className="flex gap-6 font-bold text-sm">
              {primaryMenu.map((item) => (
                <Link key={item.id} href={resolveMenuUrl(item)} className="transition-colors relative group">
                  {item.title.toUpperCase()}
                  <span className="absolute -bottom-3 left-0 w-0 h-0.5 transition-all group-hover:w-full" style={{ backgroundColor: accentColor }}></span>
                </Link>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Cari..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 rounded-full pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--news-accent)] w-48 transition-all focus:w-64 text-white" 
              />
              <button type="submit" className="absolute right-3 top-2 text-gray-400 hover:text-white">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full border-t border-gray-700 p-4 flex flex-col gap-4 shadow-xl" style={{ backgroundColor: primaryColor }}>
            <form onSubmit={handleSearch} className="relative w-full">
              <input 
                type="text" 
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--news-accent)] w-full text-white" 
              />
              <button type="submit" className="absolute right-4 top-2.5 text-gray-400 hover:text-white">
                <Search size={18} />
              </button>
            </form>
            <nav className="flex flex-col gap-4 font-bold text-sm mt-2">
              {primaryMenu.map((item) => (
                <Link key={item.id} href={resolveMenuUrl(item)} onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-800 pb-2 hover:text-[var(--news-accent)]">
                  {item.title.toUpperCase()}
                </Link>
              ))}
            </nav>
            <Link href={ctaUrl} className="text-white px-4 py-3 rounded font-bold flex justify-center items-center gap-2 text-sm mt-4 hover:opacity-90" style={{ backgroundColor: ctaColor }}>
              <Edit size={16} /> {ctaText}
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="text-white pt-8 pb-4 md:pt-12 md:pb-6 border-t-4" style={{ backgroundColor: primaryColor, borderTopColor: accentColor }}>
        <div className="container mx-auto px-4">
          {/* Top Footer Section (WA Channel / Google News) */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-10 pb-10 border-b border-gray-700 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg">
                <div className="bg-blue-500 p-2 rounded text-white font-bold">G<span className="text-red-500">N</span></div>
                <div>
                  <div className="text-xs text-gray-400">Ikuti kami di</div>
                  <div className="font-bold">Google News</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg">
                <div className="bg-green-500 p-2 rounded-full text-white"><svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg></div>
                <div>
                  <div className="text-xs text-gray-400">Ikuti WA Channel</div>
                  <div className="font-bold">{siteTitle}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-1">
              {siteLogo ? (
                <div className="mb-4">
                  <SafeImage
                    src={siteLogo}
                    alt={siteTitle}
                    width={200}
                    height={50}
                    className="h-10 w-auto object-contain brightness-0 invert"
                  />
                </div>
              ) : (
                <div className="font-black text-3xl italic tracking-tighter flex items-center mb-4 transition-colors" style={{ color: accentColor }}>
                  <span className="text-white mr-1">⚡</span>
                  {siteTitle.toUpperCase()}
                  <span className="text-white ml-1">⚡</span>
                </div>
              )}
              <p className="text-sm text-gray-400 mb-6">{siteTagline}</p>
            </div>
            
            {menuChunks.slice(0,3).map((chunk, index) => (
               <div key={index} className="flex flex-col gap-3 text-sm text-gray-300">
                  {chunk.map(item => (
                    <Link key={item.id} href={resolveMenuUrl(item)} className="hover:text-[var(--news-accent)] transition-colors">
                      {item.title}
                    </Link>
                  ))}
               </div>
            ))}
            
            {/* Fallback column if menus don't fill it */}
            {menuChunks.length < 3 && (
              <div className="flex flex-col gap-3 text-sm text-gray-300 hidden lg:flex"></div>
            )}
            {menuChunks.length < 2 && (
              <div className="flex flex-col gap-3 text-sm text-gray-300 hidden lg:flex"></div>
            )}
          </div>

          {/* Social Links Row */}
          <div className="flex flex-wrap justify-center gap-8 mb-10 pb-10 border-b border-t border-gray-700 py-8">
            {contacts.map(contact => (
               <a key={contact.id} href={contact.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[var(--news-accent)] transition-colors font-bold">
                 <span className="w-5 h-5 flex items-center justify-center">
                   {SOCIAL_ICONS[contact.iconId.toLowerCase()] || <Link className="w-5 h-5" href={contact.url} />}
                 </span>
                 {contact.title}
               </a>
            ))}
          </div>

          {/* Copyright & Cache ID */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <div>
              &copy; {new Date().getFullYear()} {siteTitle}. All Rights Reserved.
            </div>
            {cacheId && (
              <div className="opacity-50">
                CACHE ID: {cacheId}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
