import { describe, it, expect } from 'vitest';
import { getYoutubeVideoId, getYoutubeThumbnailUrl } from '@/lib/utils/embed-media';

describe('getYoutubeVideoId', () => {
  const id = 'dQw4w9WgXcQ';

  it.each([
    ['watch link', `https://www.youtube.com/watch?v=${id}`],
    ['watch link with extra params', `https://www.youtube.com/watch?feature=share&v=${id}&t=30s`],
    ['mobile watch link', `https://m.youtube.com/watch?v=${id}`],
    ['short link', `https://youtu.be/${id}`],
    ['short link with tracking', `https://youtu.be/${id}?si=abc123`],
    ['shorts link', `https://www.youtube.com/shorts/${id}`],
    ['embed link', `https://www.youtube.com/embed/${id}?rel=0`],
  ])('finds the video id in a %s', (_name, url) => {
    expect(getYoutubeVideoId(url)).toBe(id);
  });

  it('returns null for a link that is not YouTube', () => {
    expect(getYoutubeVideoId(`https://example.com/watch?v=${id}`)).toBeNull();
  });

  it('returns null for a YouTube link without a video id', () => {
    expect(getYoutubeVideoId('https://www.youtube.com/@some-channel')).toBeNull();
  });

  it('returns null when the id is not 11 characters', () => {
    expect(getYoutubeVideoId('https://www.youtube.com/watch?v=short')).toBeNull();
  });

  it('returns null for an empty string or text that is not a URL', () => {
    expect(getYoutubeVideoId('')).toBeNull();
    expect(getYoutubeVideoId('not a url')).toBeNull();
  });
});

describe('getYoutubeThumbnailUrl', () => {
  it('points at the hqdefault still of the video', () => {
    expect(getYoutubeThumbnailUrl('dQw4w9WgXcQ')).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });
});
