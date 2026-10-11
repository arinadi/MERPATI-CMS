import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { FeaturedMedia } from '@/components/featured-media';

const YOUTUBE = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const TIKTOK = 'https://www.tiktok.com/@someone/video/7234567890123456789';
const INSTAGRAM = 'https://www.instagram.com/reel/Cabc123XYZ/';
const BLOB_IMAGE = 'https://abc123.public.blob.vercel-storage.com/photo.jpg';

describe('FeaturedMedia: YouTube in a list card (interactive=false)', () => {
  it('shows the thumbnail and does not load the player', () => {
    const { container } = render(<FeaturedMedia src={YOUTUBE} alt="Berita video" interactive={false} />);

    expect(container.querySelector('iframe')).toBeNull();
    const thumbnail = screen.getByRole('img', { name: 'Berita video' });
    expect(thumbnail.getAttribute('src')).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
  });

  it('loads the thumbnail lazily so cards below the fold cost nothing', () => {
    render(<FeaturedMedia src={YOUTUBE} alt="Berita video" interactive={false} />);

    expect(screen.getByRole('img', { name: 'Berita video' }).getAttribute('loading')).toBe('lazy');
  });

  it('reads the link from the stored JSON format and prefers its alt text', () => {
    const stored = JSON.stringify({ url: YOUTUBE, alt_text: 'Cuplikan wawancara' });
    render(<FeaturedMedia src={stored} alt="Berita video" interactive={false} />);

    expect(screen.getByRole('img', { name: 'Cuplikan wawancara' }).getAttribute('src')).toContain('dQw4w9WgXcQ');
  });
});

describe('FeaturedMedia: embeds on a page that plays them', () => {
  it('embeds the YouTube player lazily with the post title', () => {
    const { container } = render(<FeaturedMedia src={YOUTUBE} alt="Berita video" />);

    const frame = container.querySelector('iframe');
    expect(frame?.getAttribute('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0');
    expect(frame?.getAttribute('loading')).toBe('lazy');
    expect(frame?.getAttribute('title')).toBe('Berita video');
  });

  it('embeds TikTok lazily', () => {
    const { container } = render(<FeaturedMedia src={TIKTOK} alt="Tiktok" />);

    const frame = container.querySelector('iframe');
    expect(frame?.getAttribute('src')).toBe('https://www.tiktok.com/embed/v2/7234567890123456789');
    expect(frame?.getAttribute('loading')).toBe('lazy');
  });

  it('embeds Instagram lazily', () => {
    const { container } = render(<FeaturedMedia src={INSTAGRAM} alt="Insta" />);

    const frame = container.querySelector('iframe');
    expect(frame?.getAttribute('src')).toBe('https://www.instagram.com/p/Cabc123XYZ/embed');
    expect(frame?.getAttribute('loading')).toBe('lazy');
  });

  it('uses the given aspect ratio for the embed box', () => {
    const { container } = render(<FeaturedMedia src={TIKTOK} alt="Tiktok" aspectRatio="aspect-[9/16]" />);

    expect(container.querySelector('iframe')?.parentElement?.className).toContain('aspect-[9/16]');
  });

  it('blocks pointer events on an embed when not interactive (TikTok)', () => {
    const { container } = render(<FeaturedMedia src={TIKTOK} alt="Tiktok" interactive={false} />);

    expect(container.querySelector('iframe')?.className).toContain('pointer-events-none');
  });
});

describe('FeaturedMedia: images', () => {
  it('renders a normal image', () => {
    render(<FeaturedMedia src={BLOB_IMAGE} alt="Foto" />);

    expect(screen.getByRole('img', { name: 'Foto' })).toBeDefined();
  });

  it('passes sizes on so a small thumbnail does not download a full-width file', () => {
    render(<FeaturedMedia src={BLOB_IMAGE} alt="Foto" fill sizes="112px" />);

    expect(screen.getByRole('img', { name: 'Foto' }).getAttribute('sizes')).toBe('112px');
  });
});

describe('FeaturedMedia: nothing to show', () => {
  it('renders the placeholder with the given class and no image or embed', () => {
    const { container } = render(<FeaturedMedia src="" alt="Kosong" className="h-10" emptyClassName="bg-red-500" />);

    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
    expect((container.firstElementChild as HTMLElement).className).toContain('bg-red-500');
    expect((container.firstElementChild as HTMLElement).className).toContain('h-10');
  });
});
