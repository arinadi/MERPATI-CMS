import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import DefaultSinglePost from '@/themes/default/components/single-post';
import NewsSinglePost from '@/themes/news/components/single-post';
import PortfolioSinglePost from '@/themes/portfolio/components/single-post';
import type { PostDisplaySettings, ThemeName } from '@/lib/post-display';

// The news theme is a server component that loads its "popular posts" itself; give it an empty sidebar.
vi.mock('@/lib/queries/posts', () => ({ getCachedTaxonomyPosts: vi.fn(), getLatestPosts: vi.fn(async () => []) }));
vi.mock('@/lib/queries/options', () => ({ getCachedOptions: vi.fn(async () => ({})) }));

const post = {
  id: 'p1',
  title: 'Story',
  slug: 'story',
  content: '<p>Body text of the story, long enough to read.</p>',
  excerpt: 'Short',
  // The default theme shows the category only as a badge on the featured image, so the post needs one.
  featuredImage: 'https://example.com/cover.jpg',
  createdAt: new Date('2026-01-02T00:00:00Z'),
  updatedAt: null,
  author: { name: 'Wati Writer', image: null },
  reporters: [{ name: 'Rina Reporter' }],
  editors: [{ name: 'Edo Editor' }],
  categories: [{ id: 'c1', name: 'Berita', slug: 'berita' }],
  tags: [{ id: 't1', name: 'Pemilu', slug: 'pemilu' }],
};

const allOn: PostDisplaySettings = { credits: true, writer: true, date_reading: true, share: true, terms: true };
const allOff: PostDisplaySettings = { credits: false, writer: false, date_reading: false, share: false, terms: false };

// Text each theme shows for a post with every part on. Each one belongs to one switch.
const textOf: Record<ThemeName, string[]> = {
  default: ['Reporter: Rina Reporter', 'Wati Writer', '2026', 'Berita', 'Pemilu'],
  news: ['Reporter: Rina Reporter', 'Wati Writer', '2026', 'menit baca', 'Berita'],
  portfolio: ['Reporter: Rina Reporter', 'Wati Writer', '2026', '5 min read', 'Berita', 'Pemilu'],
};

async function renderTheme(theme: ThemeName, postDisplay?: PostDisplaySettings) {
  const props = { post, relatedPosts: [], sharingPlatforms: '', postDisplay };
  if (theme === 'news') return render(await NewsSinglePost(props as never));
  const SinglePost = theme === 'default' ? DefaultSinglePost : PortfolioSinglePost;
  return render(<SinglePost post={post as never} relatedPosts={[]} sharingPlatforms="" postDisplay={postDisplay} />);
}

describe.each(['default', 'news', 'portfolio'] as const)('theme %s: post display switches', (theme) => {
  it('shows every part when no setting is passed', async () => {
    const { container } = await renderTheme(theme);

    for (const text of textOf[theme]) expect(container.textContent).toContain(text);
    expect(container.querySelector('a[href*="facebook.com"]')).not.toBeNull();
  });

  it('shows every part when every switch is on', async () => {
    const { container } = await renderTheme(theme, allOn);

    for (const text of textOf[theme]) expect(container.textContent).toContain(text);
    expect(container.querySelector('a[href*="facebook.com"]')).not.toBeNull();
  });

  it('hides every part when every switch is off', async () => {
    const { container } = await renderTheme(theme, allOff);

    for (const text of textOf[theme]) expect(container.textContent).not.toContain(text);
    expect(container.querySelector('a[href*="facebook.com"]')).toBeNull();
  });
});
