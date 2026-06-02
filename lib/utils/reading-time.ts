/**
 * Calculates estimated reading time for an HTML article.
 *
 * Algorithm:
 * - Strips HTML tags, counts words
 * - Applies Medium-style sliding scale for images:
 *   first image = 12s, second = 11s, ... image 11+ = 3s each
 *
 * References: docs/reading_time.md
 */
export function getReadingTime(html: string, wpm = 200): number {
  // Strip HTML tags and normalize whitespace
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Count words
  const wordCount = text.split(" ").filter(Boolean).length;

  // Count images and apply Medium sliding scale
  const imageMatches = html.match(/<img[^>]+>/gi) || [];
  let imageSeconds = 0;
  for (let i = 0; i < imageMatches.length; i++) {
    imageSeconds += Math.max(3, 12 - i);
  }

  // Total time in seconds → convert to minutes (minimum 1)
  const totalSeconds = (wordCount / wpm) * 60 + imageSeconds;
  return Math.max(1, Math.ceil(totalSeconds / 60));
}
