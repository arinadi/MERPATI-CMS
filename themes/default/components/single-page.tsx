
import type { SinglePageProps } from "@/lib/themes";

export default function SinglePage({ page }: SinglePageProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": page.title,
        "description": page.excerpt,
        "url": "#",
        "datePublished": page.createdAt ? new Date(page.createdAt).toISOString() : new Date().toISOString(),
        "dateModified": page.updatedAt ? new Date(page.updatedAt).toISOString() : (page.createdAt ? new Date(page.createdAt).toISOString() : new Date().toISOString()),
    };

    return (
        <article className="pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Page Header */}
            <header className="pt-16 pb-12 md:pt-24 md:pb-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                            {page.title}
                        </h1>
                        {page.excerpt && (
                            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
                                {page.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {page.featuredImage && (
                <div className="container mx-auto px-4 mb-12 md:mb-20">
                    <div className="aspect-[21/9] relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={page.featuredImage}
                            alt={page.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-lg prose-slate max-w-none
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                        prose-p:leading-relaxed prose-p:text-slate-600
                        prose-a:text-indigo-600 prose-a:font-bold hover:prose-a:text-indigo-500
                        prose-img:rounded-3xl prose-img:shadow-lg
                        "
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </div>
            </div>
        </article>
    );
}
