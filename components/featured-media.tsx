"use client";

import { Image as ImageIcon } from "lucide-react";
import { getFeaturedImageUrl, getFeaturedImageAlt } from "@/lib/utils/featured-image";
import { getYoutubeVideoId, getYoutubeThumbnailUrl } from "@/lib/utils/embed-media";
import { SafeImage } from "@/components/ui/safe-image";

export interface FeaturedMediaProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    // false for list cards: the card is a link, so a player could not be used there anyway.
    interactive?: boolean;
    aspectRatio?: string;
    sizes?: string;
    emptyClassName?: string;
    emptyIconClassName?: string;
}

export function FeaturedMedia({
    src,
    alt,
    className,
    priority = false,
    fill = false,
    interactive = true,
    aspectRatio = "aspect-video",
    sizes,
    emptyClassName = "bg-slate-900/50 text-white/5 border border-white/5",
    emptyIconClassName = "w-1/3 h-1/3 max-w-[4rem] max-h-[4rem] opacity-20",
}: FeaturedMediaProps) {
    // Parse JSON featured image format (backward-compatible with plain URLs)
    const mediaUrl = getFeaturedImageUrl(src) || src;
    const imageAlt = getFeaturedImageAlt(src) || alt;

    if (!mediaUrl) {
        return (
            <div className={`flex items-center justify-center ${emptyClassName} ${className ?? ""}`}>
                <ImageIcon className={emptyIconClassName} />
            </div>
        );
    }

    const embedClassName = `absolute top-0 left-0 w-full h-full border-0 ${!interactive ? "pointer-events-none" : ""}`;
    const embedBoxClassName = `relative ${aspectRatio} ${className ?? ""} bg-black overflow-hidden`;

    // A YouTube player costs about 1 MB of scripts, so lists show its thumbnail as a normal image.
    const youtubeId = getYoutubeVideoId(mediaUrl);
    if (youtubeId && interactive) {
        return (
            <div className={embedBoxClassName}>
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title={imageAlt}
                    loading="lazy"
                    className={embedClassName}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    if (mediaUrl.includes("tiktok.com")) {
        const videoId = mediaUrl.match(/\/video\/(\d+)/)?.[1];
        if (videoId) {
            return (
                <div className={embedBoxClassName}>
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${videoId}`}
                        title={imageAlt}
                        loading="lazy"
                        className={embedClassName}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
    }

    if (mediaUrl.includes("instagram.com")) {
        const postId = mediaUrl.match(/(?:p|reels|reel|tv)\/([A-Za-z0-9_-]+)/)?.[1];
        if (postId) {
            return (
                <div className={embedBoxClassName}>
                    <iframe
                        src={`https://www.instagram.com/p/${postId}/embed`}
                        title={imageAlt}
                        loading="lazy"
                        className={embedClassName}
                        {...{ allowtransparency: "true" }}
                        allowFullScreen
                    />
                </div>
            );
        }
    }

    return (
        <SafeImage
            src={youtubeId ? getYoutubeThumbnailUrl(youtubeId) : mediaUrl}
            alt={imageAlt || "Image"}
            className={className}
            width={fill ? undefined : 1200}
            height={fill ? undefined : 800}
            fill={fill}
            sizes={sizes}
            priority={priority}
        />
    );
}
