import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import type { ArchiveProps, PostCardData } from "@/lib/themes";
import { FeaturedMedia } from "./featured-media";

export default function Archive({ title, description, posts }: ArchiveProps) {
    return (
        <div className="pb-24">
            {/* Archive Header */}
            <header className="pt-20 pb-16 bg-background border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 mt-12 md:mt-20">
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                        <p className="text-muted-foreground font-medium">Belum ada konten untuk ditampilkan.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {posts.length > 0 && (
                    <div className="mt-16 flex justify-center">
                        <nav className="flex items-center gap-2">
                            <button className="px-6 py-3 rounded-xl bg-card border border-border font-bold text-foreground hover:bg-muted transition-colors shadow-sm">
                                Muat Lebih Banyak
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

export function PostCard({ post }: { post: PostCardData }) {
    const publishDate = post.createdAt ? new Date(post.createdAt) : new Date();

    return (
        <Link
            href={`/${post.slug}`}
            className="group flex flex-col bg-card rounded-3xl border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all transform hover:-translate-y-1 overflow-hidden"
        >
            <div className="aspect-[16/10] relative overflow-hidden">
                {post.featuredImage ? (
                    <FeaturedMedia
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary/40">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                )}
                {post.categories?.[0] && (
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                            {post.categories[0].name}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" />
                    {format(publishDate, "d MMM yyyy", { locale: id })}
                </div>

                <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors mb-3">
                    {post.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold border border-background shrink-0">
                            {post.author?.name?.charAt(0) || "A"}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
