"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { getFeaturedImageUrl, getFeaturedImageAlt } from "@/lib/utils/featured-image";

export function FeaturedMedia({
    src,
    alt,
    className,
    priority = false,
}: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    showCaption?: boolean;
}) {
    const [hasError, setHasError] = useState(!src);

    // Parse JSON featured image format (backward-compatible with plain URLs)
    const imageUrl = getFeaturedImageUrl(src) || src;
    const imageAlt = getFeaturedImageAlt(src) || alt;

    const isYoutube = imageUrl?.includes("youtube.com") || imageUrl?.includes("youtu.be");

    if (hasError || !imageUrl) {
        return (
            <div className={`flex items-center justify-center bg-[#0F172A] text-white/10 ${className}`}>
                <ImageIcon className="w-12 h-12" />
            </div>
        );
    }

    if (isYoutube) {
        let videoId = "";
        if (imageUrl.includes("youtu.be/")) {
            videoId = imageUrl.split("youtu.be/")[1]?.split("?")[0] || "";
        } else if (imageUrl.includes("v=")) {
            videoId = imageUrl.split("v=")[1]?.split("&")[0] || "";
        }
        
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

    return (
        <Image
            src={imageUrl}
            alt={imageAlt || "Image"}
            className={className}
            width={1200}
            height={800}
            priority={priority}
            onError={() => setHasError(true)}
        />
    );
}


