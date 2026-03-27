import { FeaturedMedia, getFeaturedImageAlt } from "./featured-media";
import type { SinglePageProps } from "@/lib/themes";

export default function SinglePage({ page }: SinglePageProps) {
    return (
        <article className="pb-32 bg-[#0B1120] min-h-screen">
            {/* Header */}
            <header className="container mx-auto px-4 pt-24 pb-16 text-center max-w-4xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                    {page.title}
                </h1>
                {page.excerpt && (
                    <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {page.excerpt}
                    </p>
                )}
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-[#1E293B]/30 rounded-[2rem] border border-white/5 p-8 md:p-12 lg:p-16 shadow-2xl">
                    {page.featuredImage && (
                        <div className="mb-12">
                            <div className="aspect-video relative rounded-2xl overflow-hidden shadow-xl bg-black border border-white/10">
                                <FeaturedMedia
                                    src={page.featuredImage}
                                    alt={page.title}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                            {getFeaturedImageAlt(page.featuredImage) && getFeaturedImageAlt(page.featuredImage) !== page.title && (
                                <p className="text-xs text-center text-gray-500 mt-3 italic">{getFeaturedImageAlt(page.featuredImage)}</p>
                            )}
                        </div>
                    )}
                    
                    <div 
                        className="article-body max-w-none mx-auto"
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </div>
            </div>
        </article>
    );
}
