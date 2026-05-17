import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedMenuWithItems } from '@/lib/queries/menus';
import { dbMock } from '@/tests/mocks/db';

describe('Menu Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array if menu location not found', async () => {
    dbMock._setResolvedValue([]); // Menu not found
    const result = await getCachedMenuWithItems('primary');
    expect(result).toEqual([]);
  });

  it('should return menu items with hydrated slugs', async () => {
    // 1. Menu query
    dbMock._setResolvedValue([{ id: 'm1', location: 'primary' }]);
    
    // 2. Menu items query
    dbMock._setResolvedValue([
      { id: 'i1', type: 'custom', title: 'Home', url: '/' },
      { id: 'i2', type: 'post', title: 'Hello', objectId: 'p1', url: null },
      { id: 'i3', type: 'category', title: 'News', objectId: 'c1', url: null },
    ]);

    // 3. Hydrate i2 (post)
    dbMock._setResolvedValue([{ slug: 'hello-world' }]);

    // 4. Hydrate i3 (category)
    dbMock._setResolvedValue([{ slug: 'news' }]);

    const result = await getCachedMenuWithItems('primary');
    const hydratedItems = result as Array<{ type: string; slug?: string }>;

    expect(result).toHaveLength(3);
    expect(hydratedItems[0].type).toBe('custom');
    expect(hydratedItems[1].slug).toBe('hello-world');
    expect(hydratedItems[2].slug).toBe('category/news');
  });
});
