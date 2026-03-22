import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ArchiveProps } from "@/lib/themes";
import { PostCard } from "./post-card";

export default function Archive({ title, description, posts, pagination }: ArchiveProps) {
    return (
        <div className="pb-24 pt-12">
            {/* Archive Header / Search Header */}
            {title && (
                <header className="py-12 md:py-20 bg-transparent border-b border-white/5 mb-12">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto space-y-4">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                                {title.startsWith("Hasil pencarian untuk:") ? (
                                    <>Hasil pencarian: <span className="text-blue-400">&quot;{title.replace("Hasil pencarian untuk: ", "").replace(/"/g, "")}&quot;</span></>
                                ) : (
                                    title
                                )}
                            </h1>
                            {description && (
                                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mt-6">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Posts Grid */}
            <div className="container mx-auto px-4">
                {posts.length === 0 ? (
                    <div className="text-center py-32 bg-[#1E293B]/30 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-400 font-medium text-lg">Belum ada konten untuk ditampilkan di kategori ini.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Pagination UI */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-20 flex justify-center">
                        <nav className="flex items-center gap-2">
                            {pagination.currentPage > 1 ? (
                                <Link 
                                    href={pagination.currentPage - 1 === 1 ? pagination.basePath : `${pagination.basePath}/page/${pagination.currentPage - 1}`} 
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1E293B] hover:bg-gray-800 border border-white/5 font-bold text-white transition-colors group"
                                >
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    <span className="sr-only">Previous</span>
                                </Link>
                            ) : (
                                <button disabled className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1E293B] border border-white/5 font-bold text-gray-500 cursor-not-allowed opacity-50">
                                    <ChevronLeft className="w-5 h-5" />
                                    <span className="sr-only">Previous</span>
                                </button>
                            )}
                            
                            <div className="px-6 py-3 rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-900/40">
                                Hal {pagination.currentPage} / {pagination.totalPages}
                            </div>
                            
                            {pagination.currentPage < pagination.totalPages ? (
                                <Link 
                                    href={`${pagination.basePath}/page/${pagination.currentPage + 1}`} 
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1E293B] hover:bg-gray-800 border border-white/5 font-bold text-white transition-colors group"
                                >
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    <span className="sr-only">Next</span>
                                </Link>
                            ) : (
                                <button disabled className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#1E293B] border border-white/5 font-bold text-gray-500 cursor-not-allowed opacity-50">
                                    <ChevronRight className="w-5 h-5" />
                                    <span className="sr-only">Next</span>
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}
