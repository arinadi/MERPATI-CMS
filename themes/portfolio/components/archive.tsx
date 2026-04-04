"use client";

import Link from "next/link";
import { format } from "date-fns";
import { FeaturedMedia } from "./featured-media";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { ArchiveProps } from "@/lib/themes";

export default function Archive({ title, posts, pagination }: ArchiveProps) {
    const isSearch = title.toLowerCase().includes("pencarian") || title.toLowerCase().includes("search");
    // Adapt the title logically for the aesthetic
    const displayTitle = isSearch ? 'Search Log.' : (title === 'Arsip' ? 'Archive Log.' : `${title}.`);

    const router = useRouter();
    const pathname = usePathname();
    
    const currentQuery = (pathname && pathname.startsWith("/search/")) 
        ? decodeURIComponent(pathname.replace("/search/", "").split("/")[0]) 
        : "";

    const [searchQuery, setSearchQuery] = useState(currentQuery);
    const [prevPath, setPrevPath] = useState(pathname);

    if (pathname !== prevPath) {
        setPrevPath(pathname);
        setSearchQuery(currentQuery);
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/search/${encodeURIComponent(q)}`);
        }
    }

    return (
        <div className="bg-zinc-950 min-h-screen text-slate-100 font-sans pb-32 pt-20">
            <div className="max-w-4xl mx-auto px-6">
                
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 font-mono text-sm hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Terminal
                </Link>

                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                    {displayTitle}
                </h1>
                
                <p className="text-zinc-500 font-mono text-sm md:text-base mb-12">
                    {"//"} {isSearch ? `Menemukan` : `Menampilkan`} {posts.length} dokumen yang tersimpan di memori.
                </p>

                <form onSubmit={handleSearch} className="relative mb-16">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ideas by title or category..." 
                        className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-base text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#00e5b7] focus:border-[#00e5b7] transition-all shadow-inner font-mono"
                    />
                </form>

                {posts.length > 0 ? (
                    <div className="flex flex-col border-t border-zinc-800">
                        {posts.map(post => (
                            <Link key={post.id} href={`/${post.slug}`} className="group flex items-center justify-between py-6 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors -mx-6 px-6">
                                <div className="flex items-center gap-6">
                                    {post.featuredImage ? (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 hidden md:block opacity-80 group-hover:opacity-100 transition-opacity">
                                            <FeaturedMedia src={post.featuredImage} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0 hidden md:block" />
                                    )}
                                    <h3 className="text-lg md:text-xl font-semibold text-zinc-200 group-hover:text-white transition-colors">{post.title}</h3>
                                </div>
                                <div className="flex items-center gap-8 md:gap-16 text-sm font-mono text-zinc-500">
                                    <span className="hidden md:block w-32 truncate">{post.categories?.[0]?.name || "Uncategorized"}</span>
                                    <span className="w-24 text-right">{format(new Date(post.createdAt || new Date()), "yyyy-MM-dd")}</span>
                                    <span className="w-16 text-right hidden sm:block">5 min</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border-t border-zinc-800 text-zinc-500 font-mono">
                        No documents found in memory.
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-16 pt-8 border-t border-zinc-800 font-mono text-sm">
                        {pagination.currentPage > 1 ? (
                            <Link 
                                href={pagination.currentPage - 1 === 1 ? pagination.basePath : `${pagination.basePath}/page/${pagination.currentPage - 1}`}
                                className="text-[#00e5b7] hover:text-white transition-colors"
                            >
                                &lt; Previous Frame
                            </Link>
                        ) : <span className="text-zinc-700">&lt; Previous Frame</span>}
                        
                        <span className="text-zinc-500">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>

                        {pagination.currentPage < pagination.totalPages ? (
                            <Link 
                                href={`${pagination.basePath}/page/${pagination.currentPage + 1}`}
                                className="text-[#00e5b7] hover:text-white transition-colors"
                            >
                                Next Frame &gt;
                            </Link>
                        ) : <span className="text-zinc-700">Next Frame &gt;</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
