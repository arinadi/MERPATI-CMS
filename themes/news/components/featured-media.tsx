"use client";

import { Image as ImageIcon } from "lucide-react";
import { getFeaturedImageUrl, getFeaturedImageAlt } from "@/lib/utils/featured-image";
import { SafeImage } from "@/components/ui/safe-image";

export function FeaturedMedia({
    src,
    alt,
    className,
    priority = false,
    fill = false,
}: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    fill?: boolean;
}) {
    // Parse JSON featured image format (backward-compatible with plain URLs)
    const imageUrl = getFeaturedImageUrl(src) || src;
    const imageAlt = getFeaturedImageAlt(src) || alt;

    const isYoutube = imageUrl?.includes("youtube.com") || imageUrl?.includes("youtu.be");

    if (!imageUrl) {
        return (
            <div className={`flex items-center justify-center bg-slate-900/50 text-white/5 border border-white/5 ${className}`}>
                <ImageIcon className="w-1/3 h-1/3 max-w-[4rem] max-h-[4rem] opacity-20" />
            </div>
        );
    }

    if (isYoutube) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = imageUrl.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : "";
        
        if (videoId) {
            return (
                <div className={`relative ${className} bg-black`}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                        title={imageAlt}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
    }

    return (
        <SafeImage
            src={imageUrl}
            alt={imageAlt || "Image"}
            className={className}
            width={fill ? undefined : 1200}
            height={fill ? undefined : 800}
            fill={fill}
            priority={priority}
        />
    );
}
