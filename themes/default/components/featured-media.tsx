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
                <div className={`relative overflow-hidden bg-black ${className}`}>
                    {/* Scale slightly (1.12) to make 16:9 perfectly object-cover a 16:10 container */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full scale-[1.15]">
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
