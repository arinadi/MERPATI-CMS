import { describe, it, expect } from 'vitest';
import { parseFeaturedImage, serializeFeaturedImage, getFeaturedImageUrl, getFeaturedImageAlt } from '@/lib/utils/featured-image';

describe('Featured Image Utilities', () => {
  const imageUrl = 'https://example.com/image.jpg';
  const altText = 'Sample image';
  const jsonRaw = JSON.stringify({ url: imageUrl, alt_text: altText });

  describe('parseFeaturedImage', () => {
    it('should return null for empty input', () => {
      expect(parseFeaturedImage(null)).toBeNull();
      expect(parseFeaturedImage(undefined)).toBeNull();
      expect(parseFeaturedImage('')).toBeNull();
    });

    it('should parse legacy plain URL strings', () => {
      const result = parseFeaturedImage(imageUrl);
      expect(result).toEqual({ url: imageUrl, altText: '' });
    });

    it('should parse JSON format', () => {
      const result = parseFeaturedImage(jsonRaw);
      expect(result).toEqual({ url: imageUrl, altText: altText });
    });
  });

  describe('serializeFeaturedImage', () => {
    it('should return plain URL if no alt text', () => {
      expect(serializeFeaturedImage(imageUrl, '')).toBe(imageUrl);
    });

    it('should return JSON if alt text is provided', () => {
      const result = serializeFeaturedImage(imageUrl, altText);
      expect(JSON.parse(result)).toEqual({ url: imageUrl, alt_text: altText });
    });
  });

  describe('Helpers', () => {
    it('getFeaturedImageUrl should extract URL', () => {
      expect(getFeaturedImageUrl(imageUrl)).toBe(imageUrl);
      expect(getFeaturedImageUrl(jsonRaw)).toBe(imageUrl);
    });

    it('getFeaturedImageAlt should extract alt text', () => {
      expect(getFeaturedImageAlt(imageUrl)).toBe('');
      expect(getFeaturedImageAlt(jsonRaw)).toBe(altText);
    });
  });
});
