import Link from "next/link";
import { format } from "date-fns";
import { FeaturedMedia } from "./featured-media";
import { ArrowRight, Cpu, Terminal, Radio, Network, Database } from "lucide-react";
import type { ArchiveProps, PostCardData } from "@/lib/themes";
import { getCachedOptions } from "@/lib/queries/options";
import { getDefault } from "../options";

const IconMap: Record<string, React.ElementType> = {
    "cpu": Cpu,
    "terminal": Terminal,
    "radio": Radio,
    "network": Network,
    "database": Database
};

function StatusBadge({ status }: { status: string }) {
    if (status === "in-development") {
        return (
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-xs text-gray-400 font-medium tracking-wide">In Development</span>
            </div>
        );
    }
    if (status === "archived") {
        return (
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs text-orange-400/80 font-medium tracking-wide">Archived</span>
            </div>
        );
    }
    // Default to Live
    return (
        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e5b7]" />
            <span className="text-xs text-gray-300 font-medium tracking-wide">Live</span>
        </div>
    );
}

function CardOne({ post, icon, status }: { post?: PostCardData, icon: string, status: string }) {
    if (!post) return null;
    const IconComponent = IconMap[icon] || Cpu;

    return (
        <Link href={`/${post.slug}`} className="relative block w-full h-full md:col-span-2 rounded-2xl overflow-hidden group bg-[#18181b] border border-white/5 p-6 md:p-10 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
            {post.featuredImage && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                    <FeaturedMedia src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/80 to-transparent" />
                </div>
            )}
            
            <div className="relative z-10 flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-[#27272a] border border-white/10 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-[#00e5b7]" />
                </div>
                <StatusBadge status={status} />
            </div>

            <div className="relative z-10 mt-16 mt-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h3>
                <p className="text-gray-400 text-base md:text-lg max-w-xl line-clamp-3">{post.excerpt}</p>
            </div>
        </Link>
    );
}

function CardSmall({ post, icon, status }: { post?: PostCardData, icon: string, status: string }) {
    if (!post) return null;
    const IconComponent = IconMap[icon] || Terminal;

    return (
        <Link href={`/${post.slug}`} className="relative block w-full rounded-2xl overflow-hidden group bg-[#18181b] border border-white/5 p-6 md:p-8 flex flex-col justify-between min-h-[240px]">
            {post.featuredImage && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                    <FeaturedMedia src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent" />
                </div>
            )}
            <div className="relative z-10 flex justify-between items-start mb-8">
                <div className="w-10 h-10 rounded-lg bg-[#27272a] border border-white/10 flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#00e5b7]" />
                </div>
                <StatusBadge status={status} />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{post.title}</h3>
                <p className="text-gray-400 text-sm md:text-base line-clamp-2">{post.excerpt}</p>
            </div>
        </Link>
    );
}

export default async function Home({ posts }: ArchiveProps) {
    const options = await getCachedOptions([
        "theme_portfolio_jumbo_text_1",
        "theme_portfolio_jumbo_text_2",
        "theme_portfolio_small_text",
        "theme_portfolio_post_1",
        "theme_portfolio_post_1_icon",
        "theme_portfolio_post_1_status",
        "theme_portfolio_post_2",
        "theme_portfolio_post_2_icon",
        "theme_portfolio_post_2_status",
        "theme_portfolio_post_3",
        "theme_portfolio_post_3_icon",
        "theme_portfolio_post_3_status",
        "theme_portfolio_cta_url"
    ]);

    const jumbo1 = options["theme_portfolio_jumbo_text_1"] || getDefault("theme_portfolio_jumbo_text_1");
    const jumbo2 = options["theme_portfolio_jumbo_text_2"] || getDefault("theme_portfolio_jumbo_text_2");
    const smallText = options["theme_portfolio_small_text"] || getDefault("theme_portfolio_small_text");
    const ctaUrl = options["theme_portfolio_cta_url"] || getDefault("theme_portfolio_cta_url");

    const post1Id = options["theme_portfolio_post_1"];
    const post2Id = options["theme_portfolio_post_2"];
    const post3Id = options["theme_portfolio_post_3"];

    const post1 = posts.find(p => p.id === post1Id) || posts[0];
    const post2 = posts.find(p => p.id === post2Id) || posts[1];
    const post3 = posts.find(p => p.id === post3Id) || posts[2];

    const icon1 = options["theme_portfolio_post_1_icon"] || getDefault("theme_portfolio_post_1_icon");
    const status1 = options["theme_portfolio_post_1_status"] || getDefault("theme_portfolio_post_1_status");
    const icon2 = options["theme_portfolio_post_2_icon"] || getDefault("theme_portfolio_post_2_icon");
    const status2 = options["theme_portfolio_post_2_status"] || getDefault("theme_portfolio_post_2_status");
    const icon3 = options["theme_portfolio_post_3_icon"] || getDefault("theme_portfolio_post_3_icon");
    const status3 = options["theme_portfolio_post_3_status"] || getDefault("theme_portfolio_post_3_status");

    const selectedIds = [post1?.id, post2?.id, post3?.id].filter(Boolean);
    const remainingPosts = posts.filter(p => !selectedIds.includes(p.id)).slice(0, 5);

    return (
        <div className="bg-[#09090b] min-h-screen text-slate-100 font-sans pb-32">
            {/* Header / Hero */}
            <section className="max-w-6xl mx-auto px-6 pt-32 pb-24 border-b border-white/5">
                <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white leading-[1.1] tracking-tight mb-2">
                    {jumbo1}
                </h1>
                <h2 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white leading-[1.1] tracking-tight mb-8">
                    {jumbo2}
                </h2>
                {smallText && (
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl leading-relaxed">
                        {smallText}
                    </p>
                )}
            </section>

            {/* Portfolio Grid Section */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <h2 className="text-3xl font-bold text-white flex-shrink-0">Portfolio</h2>
                    <div className="hidden md:block h-px bg-white/10 flex-grow mx-8" />
                    <Link 
                        href={ctaUrl} 
                        className="inline-flex items-center gap-3 px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-[#00e5b7] font-mono text-sm uppercase tracking-widest transition-all"
                    >
                        SEE MORE PRODUCT <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {post1 && <CardOne post={post1} icon={icon1} status={status1} />}
                    {/* Right column for 2 and 3 */}
                    <div className="flex flex-col gap-6">
                        {post2 && <CardSmall post={post2} icon={icon2} status={status2} />}
                        {post3 && <CardSmall post={post3} icon={icon3} status={status3} />}
                    </div>
                </div>
            </section>

            {/* Atomic Ideas (Remaining list) */}
            {remainingPosts.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 py-10">
                    <div className="flex items-center gap-8 mb-10">
                        <h2 className="text-3xl font-bold text-white flex-shrink-0">Atomic Ideas</h2>
                        <div className="h-px bg-white/10 flex-grow" />
                    </div>

                    <div className="flex flex-col border-t border-white/5">
                        {remainingPosts.map(post => (
                            <Link key={post.id} href={`/${post.slug}`} className="group flex items-center justify-between py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors -mx-6 px-6">
                                <div className="flex items-center gap-6">
                                    {post.featuredImage ? (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 hidden md:block opacity-80 group-hover:opacity-100 transition-opacity">
                                            <FeaturedMedia src={post.featuredImage} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-white/5 shrink-0 hidden md:block" />
                                    )}
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-200 group-hover:text-white transition-colors">{post.title}</h3>
                                </div>
                                <div className="flex items-center gap-8 md:gap-16 text-sm font-mono text-gray-500">
                                    <span className="hidden md:block w-32 truncate">{post.categories?.[0]?.name || "Uncategorized"}</span>
                                    <span className="w-24 text-right">{format(new Date(post.createdAt || new Date()), "yyyy-MM-dd")}</span>
                                    <span className="w-16 text-right hidden sm:block">5 min</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Link href="/archive" className="inline-flex items-center gap-2 text-[#00e5b7] font-mono text-sm uppercase tracking-widest hover:text-white transition-colors">
                            View All Entries <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
