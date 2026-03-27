/**
 * Utility to parse and serialize featuredImage as JSON with alt text.
 * Backward-compatible: plain URL strings are treated as { url, altText: "" }.
 */

export interface FeaturedImageData {
    url: string;
    altText: string;
}

/**
 * Parse a featuredImage value (from DB).
 * Handles both legacy plain-URL strings and new JSON format.
 */
export function parseFeaturedImage(raw: string | null | undefined): FeaturedImageData | null {
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && typeof parsed.url === "string") {
            return {
                url: parsed.url,
                altText: parsed.alt_text || "",
            };
        }
    } catch {
        // Not JSON — treat as legacy plain URL string
    }

    return {
        url: raw,
        altText: "",
    };
}

/**
 * Serialize featured image data to JSON string for DB storage.
 */
export function serializeFeaturedImage(url: string, altText: string): string {
    if (!altText) {
        // If no alt text, store as plain URL for simplicity
        return url;
    }
    return JSON.stringify({ url, alt_text: altText });
}

/**
 * Get the URL from a featuredImage value (convenience helper).
 * Works with both legacy plain URLs and new JSON format.
 */
export function getFeaturedImageUrl(raw: string | null | undefined): string | null {
    const data = parseFeaturedImage(raw);
    return data?.url ?? null;
}

/**
 * Get the alt text from a featuredImage value (convenience helper).
 */
export function getFeaturedImageAlt(raw: string | null | undefined): string {
    const data = parseFeaturedImage(raw);
    return data?.altText ?? "";
}
