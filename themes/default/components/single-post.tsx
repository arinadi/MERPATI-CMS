import { format } from "date-fns";
import { id } from "date-fns/locale";

import Link from "next/link";
import { Calendar, Tag, Clock } from "lucide-react";
import type { SinglePostProps } from "@/lib/themes";
import { PostCard } from "./archive";
import { ShareButtons } from "./share-buttons";

export default function SinglePost({ post, relatedPosts }: SinglePostProps) {
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
            <header className="relative pt-6 pb-8 md:pt-24 md:pb-20 overflow-hidden bg-background">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto space-y-3 md:space-y-6">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                            {post.categories?.map((cat) => (
                                <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:underline">
                                    {cat.name}
                                </Link>
                            ))}
                            {post.categories?.length > 0 && <span className="w-1 h-1 rounded-full bg-border" />}
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                5 min read
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                            {post.title}
                        </h1>

                        <p className="text-base md:text-xl text-muted-foreground leading-snug md:leading-relaxed font-medium italic border-l-4 border-primary/20 pl-4 md:pl-6">
                            {post.excerpt}
                        </p>

                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
                <div className="container mx-auto px-4 -mt-4 md:-mt-12 relative z-20">
                    <div className="aspect-[21/9] relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border-2 md:border-4 border-background">
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
            <div className="container mx-auto px-4 mt-8 md:mt-16">
                <div className="max-w-3xl mx-auto border-b border-border pb-8 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {post.author?.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={post.author.image}
                                    alt={post.author.name || "Author"}
                                    className="w-12 h-12 rounded-full ring-2 ring-primary/10 object-cover shadow-sm"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm">
                                    {post.author?.name?.charAt(0) || "U"}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground">{post.author?.name || "Admin"}</span>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {format(publishDate, "d MMMM yyyy", { locale: id })}
                                </div>
                            </div>
                        </div>
                        <ShareButtons title={post.title} text={post.excerpt || ""} />
                    </div>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: post.content || "" }}
                    />

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/tag/${tag.slug}`}
                                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full text-sm font-bold transition-colors inline-flex items-center gap-2"
                                >
                                    <Tag className="w-3.5 h-3.5" />
                                    {tag.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
                <div className="container mx-auto px-4 mt-16 md:mt-24 border-t border-border pt-12 md:pt-16">
                    <div className="max-w-3xl mx-auto mb-8">
                        <h3 className="text-2xl font-black tracking-tight text-foreground">Baca Juga</h3>
                    </div>
                    <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedPosts.map(rp => (
                            <PostCard key={rp.id} post={rp} />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
