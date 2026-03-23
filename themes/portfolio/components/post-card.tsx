import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Image as ImageIcon } from "lucide-react";
import type { PostCardData } from "@/lib/themes";
import { FeaturedMedia } from "./featured-media";

export function PostCard({ post }: { post: PostCardData }) {
    const publishDate = post.createdAt ? new Date(post.createdAt) : new Date();
    const isYoutube = post.featuredImage && (post.featuredImage.includes("youtube.com") || post.featuredImage.includes("youtu.be"));

    return (
        <div className="group flex flex-col bg-[#1E293B] rounded-2xl border border-white/5 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all transform hover:-translate-y-1 overflow-hidden h-full">
            <div className="aspect-[16/10] relative overflow-hidden shrink-0">
                {isYoutube ? (
                    <FeaturedMedia
                        src={post.featuredImage!}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300"
                    />
                ) : (
                    <Link href={`/${post.slug}`} className="block w-full h-full">
                        {post.featuredImage ? (
                            <FeaturedMedia
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center text-white/10 group-hover:bg-[#15203b] transition-colors">
                                <ImageIcon className="w-12 h-12" />
                            </div>
                        )}
                    </Link>
                )}
                {post.categories?.[0] && (
                    <div className="absolute top-4 left-4 z-10 pointer-events-none">
                        <span className="px-3 py-1.5 bg-[#0F172A]/90 backdrop-blur-md rounded-md text-[10px] font-black uppercase tracking-widest text-blue-400 shadow-sm border border-white/10">
                            {post.categories[0].name}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <Link href={`/${post.slug}`} className="block mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-white leading-snug group-hover:text-blue-400 transition-colors line-clamp-3">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                </p>

                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest border-t border-white/10 pt-5 mt-auto">
                    {format(publishDate, "dd MMM yyyy", { locale: id })}
                </div>
            </div>
        </div>
    );
}
