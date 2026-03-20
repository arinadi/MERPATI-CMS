
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
            <header className="pt-16 pb-12 md:pt-24 md:pb-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                            {page.title}
                        </h1>
                        {page.excerpt && (
                            <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto">
                                {page.excerpt}
                            </p>
                        )}
                    </div>
                </div>
            </header>

            {/* Featured Image */}
            {page.featuredImage && (
                <div className="container mx-auto px-4 mb-12 md:mb-20">
                    <div className="aspect-[21/9] relative rounded-3xl overflow-hidden shadow-xl shadow-black/10 border-4 border-background">
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
                        className="tiptap"
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </div>
            </div>
        </article>
    );
}
