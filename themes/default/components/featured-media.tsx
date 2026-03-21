import { YouTubeEmbed } from "@next/third-parties/google";

interface FeaturedMediaProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
}

export function FeaturedMedia({ src, alt, className = "", priority = false }: FeaturedMediaProps) {
    if (!src) return null;

    const isYoutube = src.includes("youtube.com") || src.includes("youtu.be");

    if (isYoutube) {
        // Extract video ID
        let videoId = "";
        try {
            if (src.includes("youtu.be")) {
                videoId = src.split("youtu.be/")[1]?.split("?")[0] || "";
            } else {
                const url = new URL(src);
                videoId = url.searchParams.get("v") || "";
            }
        } catch {
            // fallback
        }

        if (videoId) {
            return (
                <div className={`overflow-hidden bg-black flex items-center justify-center ${className}`}>
                    <div className="w-full max-w-4xl mx-auto">
                        <YouTubeEmbed videoid={videoId} params="rel=0" />
                    </div>
                </div>
            );
        }
    }

    // Default image fallback
    return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
            src={src}
            alt={alt}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            className={className}
        />
    );
}
