import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import type { ArchiveProps, PostCardData } from "@/lib/themes";

export default function Archive({ title, description, posts }: ArchiveProps) {
    return (
        <div className="pb-24">
            {/* Archive Header */}
            <header className="pt-20 pb-16 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 mt-12 md:mt-20">
                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">Belum ada konten untuk ditampilkan.</p>
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
                            <button className="px-6 py-3 rounded-xl bg-white border font-bold text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                                Muat Lebih Banyak
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
}

function PostCard({ post }: { post: PostCardData }) {
    const publishDate = post.createdAt ? new Date(post.createdAt) : new Date();

    return (
        <Link
            href={`/${post.slug}`}
            className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all transform hover:-translate-y-1 overflow-hidden"
        >
            <div className="aspect-[16/10] relative overflow-hidden">
                {post.featuredImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center text-indigo-200">
                        <ImageIcon className="w-12 h-12" />
                    </div>
                )}
                {post.categories?.[0] && (
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                            {post.categories[0].name}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    {format(publishDate, "d MMM yyyy", { locale: id })}
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors mb-3">
                    {post.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Baca Selengkapnya
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold border border-white shrink-0">
                            {post.author?.name?.charAt(0) || "A"}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
