import { describe, it, expect } from 'vitest';
import { getSocialShareLinks } from '@/lib/utils/social';

describe('Social Share Utilities', () => {
  const mockTitle = 'Hello World';
  const mockUrl = 'https://example.com/post';
  const mockExcerpt = 'This is a test post';

  it('should return all platforms by default', () => {
    const links = getSocialShareLinks(mockTitle, mockUrl);
    expect(links).toHaveLength(7);
    expect(links.map(l => l.id)).toContain('facebook');
    expect(links.map(l => l.id)).toContain('whatsapp');
  });

  it('should filter platforms if specified', () => {
    const platforms = { whatsapp: true, facebook: false, twitter: true };
    const links = getSocialShareLinks(mockTitle, mockUrl, '', platforms as any);
    expect(links).toHaveLength(2);
    expect(links.map(l => l.id)).toEqual(['whatsapp', 'twitter']);
  });

  it('should generate correct WhatsApp URL', () => {
    const links = getSocialShareLinks(mockTitle, mockUrl, mockExcerpt);
    const whatsapp = links.find(l => l.id === 'whatsapp');
    expect(whatsapp?.href).toContain('https://wa.me/?text=');
    expect(whatsapp?.href).toContain(encodeURIComponent(mockTitle));
    expect(whatsapp?.href).toContain(encodeURIComponent('utm_source=whatsapp'));
  });

  it('should generate correct Facebook URL', () => {
    const links = getSocialShareLinks(mockTitle, mockUrl, mockExcerpt);
    const facebook = links.find(l => l.id === 'facebook');
    expect(facebook?.href).toContain('https://www.facebook.com/sharer/sharer.php?u=');
    expect(facebook?.href).toContain(encodeURIComponent('utm_source=facebook'));
  });

  it('should handle URL with existing query parameters', () => {
    const urlWithQuery = 'https://example.com/post?id=123';
    const links = getSocialShareLinks(mockTitle, urlWithQuery);
    const facebook = links.find(l => l.id === 'facebook');
    // Should use & separator for UTM
    expect(facebook?.href).toContain(encodeURIComponent('id=123&utm_source=facebook'));
  });
});
