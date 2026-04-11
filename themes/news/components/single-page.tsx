import React from "react";
import { SafeImage } from "@/components/ui/safe-image";
import type { SinglePageProps } from "@/lib/themes";

export default function SinglePage({ page }: SinglePageProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-8 uppercase">
        {page.title}
      </h1>

      {page.featuredImage && (
        <div className="mb-10 relative aspect-video">
          <SafeImage 
            src={page.featuredImage} 
            alt={page.title} 
            fill
            className="w-full h-full rounded-sm object-cover"
            priority
          />
        </div>
      )}

      <div 
        className="prose prose-lg max-w-none text-gray-800 font-serif leading-relaxed prose-a:text-[var(--news-accent)] prose-a:font-bold prose-iframe:aspect-video prose-iframe:w-full prose-iframe:rounded-lg"
        dangerouslySetInnerHTML={{ __html: page.content || "" }}
      />
    </div>
  );
}
