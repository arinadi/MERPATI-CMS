const YOUTUBE_ID = /^[\w-]{11}$/;
const YOUTUBE_PATH_PREFIXES = new Set(["shorts", "embed", "v"]);

/**
 * Returns the 11-character video id of a YouTube link, or null if the link is not
 * a YouTube video. The host is checked so that "?v=..." on an unrelated site is not
 * mistaken for a video.
 */
export function getYoutubeVideoId(link: string): string | null {
    let url: URL;
    try {
        url = new URL(link);
    } catch {
        return null;
    }

    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split("/").filter(Boolean);
    let candidate: string | undefined;

    if (host === "youtu.be") {
        candidate = segments[0];
    } else if (host === "youtube.com" || host.endsWith(".youtube.com")) {
        candidate = YOUTUBE_PATH_PREFIXES.has(segments[0])
            ? segments[1]
            : url.searchParams.get("v") ?? undefined;
    }

    return candidate && YOUTUBE_ID.test(candidate) ? candidate : null;
}

// hqdefault exists for every video; maxresdefault is missing for many older ones.
export function getYoutubeThumbnailUrl(videoId: string): string {
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
