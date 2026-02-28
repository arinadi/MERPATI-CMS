/**
 * MERPATI-CMS — Utility Functions
 */

/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // spaces → hyphens
        .replace(/[^\w\-]+/g, '')    // remove non-word chars
        .replace(/\-\-+/g, '-')     // collapse hyphens
        .replace(/^-+/, '')          // trim leading hyphens
        .replace(/-+$/, '');         // trim trailing hyphens
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    });
}

/**
 * Format short date (e.g., "28 Feb 2026")
 */
export function formatDateShort(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format relative time (e.g., "2 menit yang lalu")
 */
export function timeAgo(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay < 7) return `${diffDay} hari yang lalu`;
    return formatDateShort(d);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number = 160): string {
    if (text.length <= length) return text;
    return text.substring(0, length).replace(/\s+\S*$/, '') + '...';
}

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

/**
 * Estimate reading time (in minutes)
 */
export function readingTime(content: string): number {
    const wordsPerMinute = 200; // average for Indonesian text
    const text = stripHtml(content);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Count words in HTML content
 */
export function wordCount(content: string): number {
    const text = stripHtml(content);
    return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Generate excerpt from HTML content
 */
export function generateExcerpt(content: string, length: number = 160): string {
    return truncate(stripHtml(content), length);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Format file size (bytes → human-readable)
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}
