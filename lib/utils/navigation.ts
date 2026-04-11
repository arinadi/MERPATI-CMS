/**
 * ─── NAVIGATION UTILITIES ──────────────────────────────────────────────
 * Helpers for constructing internal routing URLs.
 */

/**
 * Generates a consistent pagination URL.
 * Ensures that page 1 maps to the base path instead of /page/1.
 * 
 * @param basePath The base category or archive path (e.g., '/archive', '/category/news')
 * @param pageNum The page number to navigate to
 * @returns A formatted URL string
 */
export function getPaginationUrl(basePath: string, pageNum: number): string {
    const cleanBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
    
    if (pageNum <= 1) {
        return cleanBase || "/";
    }
    
    return `${cleanBase}/page/${pageNum}`;
}
