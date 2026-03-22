import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FeaturedMedia } from "./featured-media";
import { ShareButtons } from "./share-buttons";
import type { SinglePostProps } from "@/lib/themes";

export default function SinglePost({ post, relatedPosts }: SinglePostProps) {
    const publishDate = post.createdAt ? new Date(post.createdAt) : new Date();

    return (
        <article className="pb-16 md:pb-32 bg-[#0B1120]">
            {/* Header: Giant Title Rata Tengah */}
            <header className="container mx-auto px-4 pt-10 md:pt-20 pb-8 md:pb-12 text-center max-w-5xl">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-md">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="mt-4 md:mt-8 text-lg md:text-xl font-light text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Featured Image */}
            <div className="container mx-auto px-4 max-w-6xl mb-8 md:mb-16">
                <div className="aspect-video relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl bg-[#0F172A] border border-white/5">
                    {post.featuredImage && (
                        <FeaturedMedia
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover rounded-[2rem]"
                            priority
                        />
                    )}
                </div>
            </div>

            {/* Content Layout */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-24">
                    {/* Left: Main Content */}
                    <div className="flex-1 lg:w-2/3">
                        {/* 1. Category Badge */}
                        {post.categories && post.categories.length > 0 && (
                            <div className="mb-6 md:mb-8">
                                <Link 
                                    href={`/category/${post.categories[0].slug}`} 
                                    className="px-4 py-2 bg-blue-600/10 text-blue-400 font-bold uppercase tracking-widest text-xs rounded-full border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    {post.categories[0].name}
                                </Link>
                            </div>
                        )}

                        {/* 2. Author & Share Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-4 md:py-8 border-y border-white/10 mb-8 md:mb-12">
                            {/* Author Info */}
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 shrink-0 ring-2 ring-white/10">
                                    {post.author?.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={post.author.image} alt={post.author.name || "Author"} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {post.author?.name?.[0]?.toUpperCase() || "A"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-base">{post.author?.name || "Anonymous"}</span>
                                    <span className="text-sm text-gray-500 font-medium">
                                        {format(publishDate, "EEEE, dd MMMM yyyy", { locale: id })}
                                    </span>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="w-full md:w-auto flex justify-end">
                                <ShareButtons title={post.title} text={post.excerpt || ""} />
                            </div>
                        </div>

                        {/* 3. Article Body */}
                        <div 
                            className="prose prose-lg prose-invert max-w-none hover:prose-a:text-blue-400 prose-a:text-blue-500 prose-a:font-semibold prose-a:no-underline prose-headings:font-bold prose-headings:tracking-tight prose-img:rounded-2xl prose-img:shadow-xl"
                            dangerouslySetInnerHTML={{ __html: post.content || "" }}
                        />

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">Tag Artikel</h3>
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <Link 
                                            key={tag.id}
                                            href={`/tag/${tag.slug}`}
                                            className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-gray-800 border border-white/5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32">
                            <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8 pb-4 border-b border-white/10">
                                Artikel Terkait
                            </h3>
                            {relatedPosts && relatedPosts.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {relatedPosts.map(rp => (
                                        <Link key={rp.id} href={`/${rp.slug}`} className="group flex gap-4 bg-[#1E293B]/40 p-4 rounded-2xl hover:bg-[#1E293B] border border-transparent hover:border-white/5 transition-all">
                                            {rp.featuredImage && (
                                                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-sm">
                                                    <FeaturedMedia src={rp.featuredImage} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                            )}
                                            <div className="flex flex-col flex-1 py-1">
                                                <h4 className="font-bold text-gray-200 group-hover:text-white line-clamp-2 text-sm leading-snug mb-2 transition-colors">
                                                    {rp.title}
                                                </h4>
                                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mt-auto">
                                                    {format(new Date(rp.createdAt || new Date()), "dd MMM yyyy", { locale: id })}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Tidak ada artikel terkait.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
