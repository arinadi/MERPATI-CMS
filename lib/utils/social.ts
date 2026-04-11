/**
 * ─── SOCIAL SHARE UTILITIES ──────────────────────────────────────────────
 * Logic-only functions for generating social share URLs.
 * Design/Icons remain theme-specific.
 */

export interface ShareLinkData {
    id: string;
    name: string;
    href: string;
    color?: string; // Brand colors for convenience
}

export function getSocialShareLinks(
    title: string,
    url: string,
    excerpt: string = "",
    platforms: Record<string, boolean> | null = null
): ShareLinkData[] {
    const encodedTitle = encodeURIComponent(title);
    const encodedExcerpt = encodeURIComponent(excerpt);
    
    // Construct absolute URL with UTM tags
    const getTargetUrlWithUtm = (platform: string) => {
        const separator = url.includes("?") ? "&" : "?";
        const utm = `${separator}utm_source=${platform.toLowerCase()}&utm_medium=social&utm_campaign=share`;
        return encodeURIComponent(url + utm);
    };

    const links: ShareLinkData[] = [
        {
            id: "whatsapp",
            name: "WhatsApp",
            href: `https://wa.me/?text=*${encodedTitle}*%0A%0A${decodeURIComponent(getTargetUrlWithUtm("WhatsApp"))}${excerpt ? `%0A%0A${encodedExcerpt}` : ""}`,
            color: "#25D366"
        },
        {
            id: "facebook",
            name: "Facebook",
            // Using quote parameter for better content pre-fill
            href: `https://www.facebook.com/sharer/sharer.php?u=${getTargetUrlWithUtm("Facebook")}${excerpt ? `&quote=${encodedExcerpt}` : ""}`,
            color: "#1877F2"
        },
        {
            id: "twitter",
            name: "X",
            href: `https://twitter.com/intent/tweet?url=${getTargetUrlWithUtm("X")}&text=${encodedTitle}`,
            color: "#000000"
        },
        {
            id: "telegram",
            name: "Telegram",
            // Fixed Telegram double URL logic
            href: `https://t.me/share/url?url=${getTargetUrlWithUtm("Telegram")}&text=${encodedTitle}${excerpt ? `%0A%0A${encodedExcerpt}` : ""}`,
            color: "#0088cc"
        },
        {
            id: "linkedin",
            name: "LinkedIn",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${getTargetUrlWithUtm("LinkedIn")}`,
            color: "#0A66C2"
        },
        {
            id: "reddit",
            name: "Reddit",
            href: `https://reddit.com/submit?url=${getTargetUrlWithUtm("Reddit")}&title=${encodedTitle}`,
            color: "#FF4500"
        },
        {
            id: "threads",
            name: "Threads",
            href: `https://www.threads.net/intent/post?text=${encodedTitle}%0A${getTargetUrlWithUtm("Threads")}`,
            color: "#000000"
        }
    ];

    // Filter based on active platforms if provided
    if (platforms) {
        return links.filter(link => platforms[link.id] === true);
    }

    return links;
}
