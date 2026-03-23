

export function FeaturedMedia({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
}) {
    const isYoutube = src.includes("youtube.com") || src.includes("youtu.be");

    if (isYoutube) {
        let videoId = "";
        if (src.includes("youtu.be/")) {
            videoId = src.split("youtu.be/")[1]?.split("?")[0] || "";
        } else if (src.includes("v=")) {
            videoId = src.split("v=")[1]?.split("&")[0] || "";
        }
        
        return (
            <div className={`relative ${className} bg-black`}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                    title={alt}
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
            src={src}
            alt={alt}
            className={className}
        />
    );
}
