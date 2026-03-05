import { format } from "date-fns";
import { id } from "date-fns/locale";

import Link from "next/link";
import { Calendar, Tag, Clock } from "lucide-react";
import type { SinglePostProps } from "@/lib/themes";

export default function SinglePost({ post }: SinglePostProps) {
    const publishDate = post.createdAt ? new Date(post.createdAt) : new Date();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.featuredImage ? [post.featuredImage] : [],
        "datePublished": publishDate.toISOString(),
        "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : publishDate.toISOString(),
        "author": [
            {
                "@type": "Person",
                "name": post.author?.name || "Admin",
                "url": "#",
            },
        ],
    };

    return (
        <article className="pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Post Header */}
            <header className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden bg-white">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-indigo-600">
                            {post.categories?.map((cat) => (
                                <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:underline">
                                    {cat.name}
                                </Link>
                            ))}
                            {post.categories?.length > 0 && <span className="w-1 h-1 rounded-full bg-slate-300" />}
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <Clock className="w-3.5 h-3.5" />
                                5 min read
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            {post.title}
                        </h1>

                        <p className="text-xl text-slate-500 leading-relaxed font-medium italic border-l-4 border-indigo-100 pl-6">
                            {post.excerpt}
                        </p>

                        <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                {post.author?.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={post.author.image}
                                        alt={post.author.name || "Author"}
                                        className="w-10 h-10 rounded-full ring-2 ring-indigo-50 object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {post.author?.name?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">{post.author?.name || "Admin"}</span>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {format(publishDate, "d MMMM yyyy", { locale: id })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-20">
                    <div className="aspect-[21/9] relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-100 border-4 border-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="container mx-auto px-4 mt-12 md:mt-20">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                        prose-p:leading-relaxed prose-p:text-slate-600
                        prose-a:text-indigo-600 prose-a:font-bold hover:prose-a:text-indigo-500
                        prose-img:rounded-3xl prose-img:shadow-lg
                        prose-blockquote:border-l-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
                        "
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/tag/${tag.slug}`}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-sm font-bold transition-colors inline-flex items-center gap-2"
                                >
                                    <Tag className="w-3.5 h-3.5" />
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
