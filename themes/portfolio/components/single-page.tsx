import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { SinglePageProps } from "@/lib/themes";
import { FeaturedMedia, getFeaturedImageAlt } from "./featured-media";

export default function SinglePage({ page }: SinglePageProps) {
    if (!page) {
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

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-[64px] font-bold text-white leading-[1.1] tracking-tight mb-8">
                    {page.title}
                </h1>

                {/* Featured Image */}
                {page.featuredImage && (
                    <div className="mb-16">
                        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900">
                            <FeaturedMedia
                                src={page.featuredImage}
                                alt={page.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {getFeaturedImageAlt(page.featuredImage) && getFeaturedImageAlt(page.featuredImage) !== page.title && (
                            <p className="text-xs text-center text-zinc-500 mt-3 italic">{getFeaturedImageAlt(page.featuredImage)}</p>
                        )}
                    </div>
                )}

                {/* Content */}
                <div 
                    className="prose prose-invert prose-zinc max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-a:text-[#00e5b7] prose-a:no-underline hover:prose-a:underline prose-code:font-mono prose-code:text-[#00e5b7] prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-hr:border-zinc-800 prose-blockquote:border-[#00e5b7] prose-blockquote:bg-zinc-900/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-iframe:w-full prose-iframe:aspect-video prose-iframe:rounded-xl leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ __html: page.content || "" }}
                />

            </article>
        </div>
    );
}
