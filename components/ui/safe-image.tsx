"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Image as ImageIcon } from "lucide-react";

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
    const [isLoadError, setIsLoadError] = useState(!src);
    
    // Check if the domain is configured for next/image optimization
    let isSafeToOptimize = true;
    if (typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"))) {
        try {
            const url = new URL(src);
            const hostname = url.hostname;
            isSafeToOptimize = ALLOWED_DOMAINS.some(domain => 
                hostname === domain || hostname.endsWith("." + domain)
            );
        } catch (e) {
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
    if (!isSafeToOptimize && typeof src === "string") {
        return (
            <img
                src={src}
                alt={alt || "Image"}
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
            src={src}
            alt={alt || "Image"}
            onError={() => setIsLoadError(true)}
        />
    );
}
