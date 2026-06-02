import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FeaturedMedia } from "./featured-media";
import { getFeaturedImageAlt } from "@/lib/utils/featured-image";
import { ShareButtons } from "./share-buttons";
import { SafeImage } from "@/components/ui/safe-image";
import type { SinglePostProps } from "@/lib/themes";

export default function SinglePost({ post, relatedPosts, sharingPlatforms }: SinglePostProps) {
    const publishDate = post.createdAt ? new Date(post.createdAt) : new Date();

    return (
        <article className="pb-16 md:pb-32 bg-[#0B1120]">
            {/* Header: Giant Title Rata Tengah */}
            <header className="container mx-auto px-4 pt-10 md:pt-20 pb-8 md:pb-12 text-center max-w-5xl">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-md">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="hidden md:block mt-4 md:mt-8 text-lg md:text-xl font-light text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Featured Image */}
            <div className="container mx-auto px-4 max-w-6xl mb-8 md:mb-16">
                {post.featuredImage && (
                    <div className={`relative overflow-hidden shadow-2xl bg-[#0F172A] border border-white/5 mx-auto ${
                        (post.featuredImage.includes("tiktok.com") || post.featuredImage.includes("instagram.com")) 
                        ? "aspect-[9/16] max-w-[400px] rounded-3xl" 
                        : "aspect-video rounded-2xl md:rounded-[2rem]"
                    }`}>
                        <FeaturedMedia
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            priority
                            aspectRatio={(post.featuredImage.includes("tiktok.com") || post.featuredImage.includes("instagram.com")) ? "aspect-[9/16]" : "aspect-video"}
                        />
                        {/* Category Badge Overlay */}
                        {post.categories && post.categories.length > 0 && (
                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                <Link 
                                    href={`/category/${post.categories[0].slug}`} 
                                    className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white font-bold uppercase tracking-widest text-[10px] rounded-full border border-white/20 hover:bg-blue-600 hover:border-blue-500 transition-colors"
                                >
                                    {post.categories[0].name}
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {post.featuredImage && getFeaturedImageAlt(post.featuredImage) && getFeaturedImageAlt(post.featuredImage) !== post.title && (
                    <p className="text-xs text-center text-gray-500 mt-3 italic">{getFeaturedImageAlt(post.featuredImage)}</p>
                )}
            </div>

            {/* Content Layout */}
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-16 lg:gap-24">
                    {/* Left: Main Content */}
                    <div className="flex-1 lg:w-2/3">

                        {/* 2. Author & Share Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3 md:py-4 border-y border-white/10 mb-6 md:mb-10">
                            {/* Author Info */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 shrink-0 ring-2 ring-white/10 relative">
                                    {post.author?.image ? (
                                        <SafeImage src={post.author.image} alt={post.author.name || "Author"} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                            {post.author?.name?.[0]?.toUpperCase() || "A"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-sm">{post.author?.name || "Anonymous"}</span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {format(publishDate, "EEEE, dd MMMM yyyy", { locale: id })}
                                    </span>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="w-full md:w-auto flex justify-end">
                                <ShareButtons title={post.title} excerpt={post.excerpt || ""} sharingPlatforms={sharingPlatforms} />
                            </div>
                        </div>

                        {/* 3. Article Body */}
                        <div 
                            className="article-body max-w-none"
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
