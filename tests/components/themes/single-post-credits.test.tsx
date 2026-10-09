import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import DefaultSinglePost from '@/themes/default/components/single-post';
import NewsSinglePost from '@/themes/news/components/single-post';

// The news theme is a server component that loads its "popular posts" itself; give it an empty sidebar.
vi.mock('@/lib/queries/posts', () => ({ getCachedTaxonomyPosts: vi.fn(), getLatestPosts: vi.fn(async () => []) }));
vi.mock('@/lib/queries/options', () => ({ getCachedOptions: vi.fn(async () => ({})) }));
import PortfolioSinglePost from '@/themes/portfolio/components/single-post';

const post = {
  id: 'p1',
  title: 'Story',
  slug: 'story',
  content: '<p>Body</p>',
  excerpt: 'Short',
  featuredImage: null,
  createdAt: new Date('2026-01-02T00:00:00Z'),
  updatedAt: null,
  author: { name: 'Wati Writer', image: null },
  categories: [],
  tags: [],
};

const themes = [
  ['default', DefaultSinglePost],
  ['portfolio', PortfolioSinglePost],
] as const;

describe.each(themes)('theme %s: single post credits', (_name, SinglePost) => {
  it('shows the reporter and the editor of the post', () => {
    const credited = { ...post, reporter: { name: 'Rina Reporter' }, editor: { name: 'Edo Editor' } };

    render(<SinglePost post={credited as never} relatedPosts={[]} />);

    expect(screen.getAllByText('Reporter: Rina Reporter').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Editor: Edo Editor').length).toBeGreaterThan(0);
  });

  it('shows no credit line when the post has none', () => {
    const plain = { ...post, reporter: null, editor: null };

    render(<SinglePost post={plain as never} relatedPosts={[]} />);

    expect(screen.queryByText(/Reporter:/)).toBeNull();
    expect(screen.queryByText(/Editor:/)).toBeNull();
  });
});

describe('theme news: single post credits', () => {
  it('shows the reporter and the editor of the post', async () => {
    const credited = { ...post, reporter: { name: 'Rina Reporter' }, editor: { name: 'Edo Editor' } };

    render(await NewsSinglePost({ post: credited as never, relatedPosts: [] }));

    expect(screen.getAllByText('Reporter: Rina Reporter').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Editor: Edo Editor').length).toBeGreaterThan(0);
  });

  it('shows no credit line when the post has none', async () => {
    const plain = { ...post, reporter: null, editor: null };

    render(await NewsSinglePost({ post: plain as never, relatedPosts: [] }));

    expect(screen.queryByText(/Reporter:/)).toBeNull();
    expect(screen.queryByText(/Editor:/)).toBeNull();
  });
});
