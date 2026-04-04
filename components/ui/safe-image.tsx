"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

// Daftar hostname yang dikonfigurasi di next.config.ts
const ALLOWED_DOMAINS = [
    "public.blob.vercel-storage.com",
    "googleusercontent.com",
    "images.unsplash.com",
    "githubusercontent.com",
];

export function SafeImage({ src, alt, ...props }: ImageProps) {
    const [hasError, setHasError] = useState(false);
    const [isSafeToOptimize, setIsSafeToOptimize] = useState(true);

    useEffect(() => {
        if (typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"))) {
            try {
                const url = new URL(src);
                const hostname = url.hostname;
                
                const isAllowed = ALLOWED_DOMAINS.some(domain => 
                    hostname === domain || hostname.endsWith("." + domain)
                );
                
                setIsSafeToOptimize(isAllowed);
            } catch (e) {
                setIsSafeToOptimize(false);
            }
        } else {
            // Local images or imports are always safe
            setIsSafeToOptimize(true);
        }
    }, [src]);

    if (hasError) {
        // Fallback placeholder jika gambar gagal load sepenuhnya
        return (
            <div className={`flex items-center justify-center bg-gray-900 text-white/10 ${props.className}`}>
                <span className="text-xs">Image Error</span>
            </div>
        );
    }

    if (!isSafeToOptimize && typeof src === "string") {
        return (
            <img
                src={src}
                alt={alt || "Image"}
                className={props.className}
                onError={() => setHasError(true)}
                style={props.fill ? { position: "absolute", height: "100%", width: "100%", inset: 0, objectFit: "cover" } : props.style}
            />
        );
    }

    return (
        <Image
            {...props}
            src={src}
            alt={alt || "Image"}
            onError={() => setHasError(true)}
        />
    );
}
