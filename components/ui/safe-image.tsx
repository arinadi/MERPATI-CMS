"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { parseFeaturedImage } from "@/lib/utils/featured-image";

/**
 * SafeImage Component
 * 
 * Handles two critical cases in MERPATI CMS:
 * 1. SSR Fatal Error: Fallback to standard <img> if the hostname is not configured in next.config.ts.
 * 2. Load Error: Show a placeholder icon if the image URL is 404 or fails to load.
 * 
 * Caching Audit:
 * This component is "use client" but remains compatible with Next.js unstable_cache and ISR.
 * It does not use browser-only globals (window, document) during initial render,
 * ensuring no hydration mismatches between server and client.
 */

const ALLOWED_DOMAINS = [
    "public.blob.vercel-storage.com",
    "googleusercontent.com",
    "images.unsplash.com",
    "githubusercontent.com",
];

export function SafeImage({ src, alt, ...props }: ImageProps) {
    // Parse featured image data (handles JSON strings from DB)
    const mediaData = typeof src === "string" ? parseFeaturedImage(src) : null;
    const finalSrc = mediaData ? mediaData.url : src;
    const finalAlt = (mediaData?.altText) || alt || "Image";

    const [isLoadError, setIsLoadError] = useState(!finalSrc);
    
    // Check if the domain is configured for next/image optimization
    let isSafeToOptimize = true;
    if (typeof finalSrc === "string" && (finalSrc.startsWith("http://") || finalSrc.startsWith("https://"))) {
        try {
            const url = new URL(finalSrc);
            const hostname = url.hostname;
            isSafeToOptimize = ALLOWED_DOMAINS.some(domain => 
                hostname === domain || hostname.endsWith("." + domain)
            );
        } catch {
            isSafeToOptimize = false;
        }
    }

    // Show fallback icon if src is empty or image failed to load
    if (!src || isLoadError) {
        return (
            <div className={`flex items-center justify-center bg-slate-900/50 text-white/5 border border-white/5 ${props.className}`}>
                <ImageIcon className="w-1/3 h-1/3 max-w-[4rem] max-h-[4rem] opacity-20" />
            </div>
        );
    }

    // Use standard <img> for unknown domains to prevent Next.js SSR crashes
    if (!isSafeToOptimize && typeof finalSrc === "string") {
        return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
                src={finalSrc}
                alt={finalAlt}
                className={props.className}
                onError={() => setIsLoadError(true)}
                style={props.fill ? { position: "absolute", height: "100%", width: "100%", inset: 0, objectFit: "cover" } : props.style}
            />
        );
    }

    // Use next/image for optimized domains
    return (
        <Image
            {...props}
            src={finalSrc as string | ImageProps["src"]}
            alt={finalAlt}
            onError={() => setIsLoadError(true)}
        />
    );
}
