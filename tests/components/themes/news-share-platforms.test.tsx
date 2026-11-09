import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NewsSinglePost from '@/themes/news/components/single-post';

// The news theme is a server component that loads its "popular posts" itself; give it an empty sidebar.
vi.mock('@/lib/queries/posts', () => ({ getCachedTaxonomyPosts: vi.fn(), getLatestPosts: vi.fn(async () => []) }));
vi.mock('@/lib/queries/options', () => ({ getCachedOptions: vi.fn(async () => ({})) }));

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

async function renderNews(sharingPlatforms: string) {
  return render(await NewsSinglePost({ post, relatedPosts: [], sharingPlatforms } as never));
}

describe('news theme: sharing platforms from the admin setting', () => {
  it('shows only the platforms switched on in the sharing setting', async () => {
    const { container } = await renderNews(JSON.stringify({ facebook: true, whatsapp: false }));

    expect(container.querySelector('a[href*="facebook.com"]')).not.toBeNull();
    expect(container.querySelector('a[href*="wa.me"]')).toBeNull();
  });

  it('shows every platform when the sharing setting is empty', async () => {
    const { container } = await renderNews('');

    expect(container.querySelector('a[href*="facebook.com"]')).not.toBeNull();
    expect(container.querySelector('a[href*="wa.me"]')).not.toBeNull();
  });
});
