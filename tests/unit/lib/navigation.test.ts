import { describe, it, expect } from 'vitest';
import { getPaginationUrl } from '@/lib/utils/navigation';

describe('getPaginationUrl', () => {
  it('should return base path for page 1', () => {
    expect(getPaginationUrl('/category/news', 1)).toBe('/category/news');
  });

  it('should return base path for page numbers less than 1', () => {
    expect(getPaginationUrl('/category/news', 0)).toBe('/category/news');
    expect(getPaginationUrl('/category/news', -5)).toBe('/category/news');
  });

  it('should append /page/n for pages greater than 1', () => {
    expect(getPaginationUrl('/category/news', 2)).toBe('/category/news/page/2');
    expect(getPaginationUrl('/category/news', 10)).toBe('/category/news/page/10');
  });

  it('should handle base path with trailing slash', () => {
    expect(getPaginationUrl('/category/news/', 1)).toBe('/category/news');
    expect(getPaginationUrl('/category/news/', 2)).toBe('/category/news/page/2');
  });

  it('should return / for empty base path and page 1', () => {
    expect(getPaginationUrl('', 1)).toBe('/');
  });

  it('should handle root path correctly', () => {
    expect(getPaginationUrl('/', 1)).toBe('/');
    expect(getPaginationUrl('/', 2)).toBe('/page/2');
  });
});
