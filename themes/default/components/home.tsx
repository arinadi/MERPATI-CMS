import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import type { ArchiveProps } from "@/lib/themes";
import { PostCard } from "./post-card";
import { FeaturedMedia } from "./featured-media";

export default function Home({ posts }: ArchiveProps) {
    if (!posts || posts.length === 0) {
        return (
            <div className="container mx-auto px-4 py-32 text-center text-gray-400">
                <p>Belum ada artikel untuk ditampilkan.</p>
            </div>
        );
    }

    const featuredPost = posts[0];
    const listPosts = posts.slice(1, 5);
    const gridPosts = posts.slice(5, 8);

    return (
        <div className="pb-24">
            {/* Hero Section (50:50) */}
            {featuredPost && (
                <section className="container mx-auto px-4 mt-8 md:mt-12 mb-16">
                    <div className="rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row bg-[#1E293B]/50 shadow-2xl">
                        <div className="w-full md:w-1/2 aspect-video md:aspect-auto relative order-1 md:order-2">
                            {featuredPost.featuredImage ? (
                                <Link href={`/${featuredPost.slug}`}>
                                    <FeaturedMedia src={featuredPost.featuredImage} alt={featuredPost.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" priority />
                                </Link>
                            ) : (
                                <div className="w-full h-full bg-[#0F172A] flex items-center justify-center text-white/10">
                                    <ImageIcon className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        <div className="p-8 md:p-12 lg:p-16 flex-1 flex flex-col justify-center order-2 md:order-1 relative z-10 bg-gradient-to-r from-[#0B1120] via-[#0B1120]/95 to-transparent">
                            {featuredPost.categories?.[0] && (
                                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4 inline-block">
                                    {featuredPost.categories[0].name}
                                </span>
                            )}
                            <Link href={`/${featuredPost.slug}`}>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 hover:text-blue-400 transition-colors drop-shadow-sm">
                                    {featuredPost.title}
                                </h1>
                            </Link>
                            <p className="text-base lg:text-lg text-gray-400 mb-8 max-w-lg line-clamp-3">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center gap-6 mt-auto">
                                <span className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(featuredPost.createdAt || new Date()), "d MMM yyyy", { locale: id })}
                                </span>
                                <Link href={`/${featuredPost.slug}`} className="hidden sm:flex items-center gap-2 text-blue-400 font-bold ml-auto hover:text-white transition-colors group">
                                    Baca Selengkapnya
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* List Section (4 Items) */}
            {listPosts.length > 0 && (
                <section className="container mx-auto px-4 mb-20">
                    <div className="flex flex-col gap-12 lg:gap-16">
                        {listPosts.map((post) => (
                            <Link key={post.id} href={`/${post.slug}`} className="group flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-12 transition-all">
                                <div className="w-full md:w-[45%] lg:w-[40%] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden relative shadow-lg">
                                    {post.featuredImage ? (
                                        <FeaturedMedia src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-[#0F172A] flex items-center justify-center text-white/5">
                                            <ImageIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 py-2 md:py-6 justify-center h-full">
                                    {post.categories?.[0] && (
                                        <span className="text-sm font-bold uppercase tracking-widest text-[#38BDF8] mb-4 block">
                                            {post.categories[0].name}
                                        </span>
                                    )}
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-100 group-hover:text-blue-400 leading-tight mb-5 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-lg text-gray-400 leading-relaxed line-clamp-2 md:line-clamp-3 mb-6">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mt-auto">
                                        {format(new Date(post.createdAt || new Date()), "d MMM yyyy", { locale: id })}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Grid Section */}
            {gridPosts.length > 0 && (
                <section className="container mx-auto px-4 mb-16">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {gridPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </section>
            )}

            {/* Huge CTA Button */}
            {posts.length > 0 && (
                <section className="container mx-auto px-4 text-center mt-20">
                    <Link href="/archive" className="inline-flex items-center justify-center px-12 py-5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg tracking-widest uppercase transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/50">
                        More Posts
                    </Link>
                </section>
            )}
        </div>
    );
}
