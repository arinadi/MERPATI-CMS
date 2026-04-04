import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SinglePostProps } from "@/lib/themes";
import { FeaturedMedia, getFeaturedImageAlt } from "./featured-media";
import { ShareButtons } from "./share-buttons";

export default function SinglePost({ post, relatedPosts }: SinglePostProps) {
    if (!post) {
        return (
            <div className="container mx-auto px-4 py-32 text-center text-zinc-500 font-mono">
                <p>Dokumen tidak ditemukan di memori.</p>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950 min-h-screen text-slate-100 font-sans pb-32 pt-20">
            <article className="max-w-4xl mx-auto px-6">
                
                {/* Back Navigation */}
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 font-mono text-sm hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Terminal
                </Link>

                {/* Header Subtitle */}
                {post.categories && post.categories.length > 0 && (
                    <div className="flex items-center gap-3 mb-6 font-mono text-sm tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-[#00e5b7]" />
                        <span className="text-[#00e5b7]">{post.categories[0].name}</span>
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white leading-[1.1] tracking-tight mb-8">
                    {post.title}
                </h1>

                {/* Meta */}
                <div className="flex items-center gap-6 font-mono text-sm text-zinc-500 border-b border-zinc-800 pb-10 mb-10">
                    <span>{format(new Date(post.createdAt || new Date()), "dd MMMM yyyy", { locale: id })}</span>
                    <span>{"//"}</span>
                    <span>By {post.author?.name || "SystemAdmin"}</span>
                    <span>{"//"}</span>
                    <span>5 min read</span>
                </div>

                {/* Featured Image */}
                {post.featuredImage && (
                    <div className="mb-16">
                        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900">
                            <FeaturedMedia
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {getFeaturedImageAlt(post.featuredImage) && getFeaturedImageAlt(post.featuredImage) !== post.title && (
                            <p className="text-xs text-center text-zinc-500 mt-3 italic">{getFeaturedImageAlt(post.featuredImage)}</p>
                        )}
                    </div>
                )}

                {/* Content */}
                <div 
                    className="prose prose-invert prose-zinc max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-a:text-[#00e5b7] prose-a:no-underline hover:prose-a:underline prose-code:font-mono prose-code:text-[#00e5b7] prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-hr:border-zinc-800 prose-blockquote:border-[#00e5b7] prose-blockquote:bg-zinc-900/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center gap-4 flex-wrap">
                        <span className="text-zinc-500 font-mono text-sm">Indexed Tags:</span>
                        {post.tags.map(tag => (
                            <Link key={tag.id} href={`/tag/${tag.slug}`} className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-xs hover:text-white hover:border-zinc-600 transition-colors">
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Share Buttons */}
                <div className="mt-10 pt-8 border-t border-zinc-800">
                    <ShareButtons title={post.title} />
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className="max-w-4xl mx-auto px-6 mt-24">
                    <div className="flex items-center gap-8 mb-10">
                        <h2 className="text-2xl font-bold text-white flex-shrink-0">Related Logs</h2>
                        <div className="h-px bg-zinc-800 flex-grow" />
                    </div>

                    <div className="flex flex-col border-t border-zinc-800">
                        {relatedPosts.slice(0, 3).map(related => (
                            <Link key={related.id} href={`/${related.slug}`} className="group flex items-center justify-between py-6 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors -mx-6 px-6">
                                <div className="flex items-center gap-6">
                                    <h3 className="text-lg md:text-xl font-semibold text-zinc-200 group-hover:text-white transition-colors">{related.title}</h3>
                                </div>
                                <div className="flex items-center gap-8 text-sm font-mono text-zinc-500">
                                    <span className="w-24 text-right hidden sm:block">{format(new Date(related.createdAt || new Date()), "yyyy-MM-dd")}</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-[#00e5b7] transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
