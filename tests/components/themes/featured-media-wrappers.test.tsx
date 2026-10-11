import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { FeaturedMedia as DefaultMedia } from '@/themes/default/components/featured-media';
import { FeaturedMedia as NewsMedia } from '@/themes/news/components/featured-media';
import { FeaturedMedia as PortfolioMedia } from '@/themes/portfolio/components/featured-media';

const YOUTUBE = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const TIKTOK = 'https://www.tiktok.com/@someone/video/7234567890123456789';

const themes = [
  { name: 'default', Media: DefaultMedia, aspect: 'aspect-[16/10]', placeholder: 'bg-[#0F172A]' },
  { name: 'news', Media: NewsMedia, aspect: 'aspect-video', placeholder: 'bg-slate-900/50' },
  { name: 'portfolio', Media: PortfolioMedia, aspect: 'aspect-video', placeholder: 'bg-[#0F172A]' },
];

describe.each(themes)('$name theme FeaturedMedia', ({ Media, aspect, placeholder }) => {
  it('does not load the YouTube player for a list card', () => {
    const { container } = render(<Media src={YOUTUBE} alt="Video" interactive={false} />);

    expect(container.querySelector('iframe')).toBeNull();
  });

  it('plays an embed lazily where it is interactive', () => {
    const { container } = render(<Media src={TIKTOK} alt="Video" />);

    expect(container.querySelector('iframe')?.getAttribute('loading')).toBe('lazy');
  });

  it('keeps the theme default aspect ratio for embeds', () => {
    const { container } = render(<Media src={TIKTOK} alt="Video" />);

    expect(container.querySelector('iframe')?.parentElement?.className).toContain(aspect);
  });

  it('keeps the theme placeholder style when there is no media', () => {
    const { container } = render(<Media src="" alt="Kosong" />);

    expect((container.firstElementChild as HTMLElement).className).toContain(placeholder);
  });
});
