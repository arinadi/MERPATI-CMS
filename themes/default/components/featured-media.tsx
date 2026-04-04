import { getFeaturedImageUrl, getFeaturedImageAlt } from "@/lib/utils/featured-image";

export function FeaturedMedia({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
    showCaption?: boolean;
}) {
    // Parse JSON featured image format (backward-compatible with plain URLs)
    const imageUrl = getFeaturedImageUrl(src) || src;
    const imageAlt = getFeaturedImageAlt(src) || alt;

    const isYoutube = imageUrl.includes("youtube.com") || imageUrl.includes("youtu.be");

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={imageUrl}
            alt={imageAlt}
            className={className}
        />
    );
}

/**
 * Re-export for use by parent components to render captions outside overflow containers.
 */
export { getFeaturedImageAlt };
