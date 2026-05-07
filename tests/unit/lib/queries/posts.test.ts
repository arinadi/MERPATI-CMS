import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getCachedPost, 
  getCachedArchivePosts, 
  getCachedPage, 
  getCachedTaxonomyPosts, 
  getCachedSearchResults, 
  getCachedMetadata, 
  getLatestPosts, 
  getCachedPostById 
} from '@/lib/queries/posts';
import { dbMock } from '@/tests/mocks/db';

describe('Post Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCachedPost', () => {
    it('should return post with categories and related posts', async () => {
      dbMock._setResolvedValue([{ id: 'post-1', title: 'Post 1', slug: 'post-1', status: 'published', type: 'post', author: { name: 'Admin' } }]);
      dbMock._setResolvedValue([{ id: 'cat-1', name: 'News', slug: 'news', taxonomy: 'category' }, { id: 'tag-1', name: 'Hot', slug: 'hot', taxonomy: 'tag' }]);
      dbMock._setResolvedValue([{ relatedPostId: 'post-2' }]);
      dbMock._setResolvedValue([{ id: 'post-2', title: 'Post 2', slug: 'post-2' }]);
      dbMock._setResolvedValue([{ id: 'cat-1', name: 'News', slug: 'news' }]);

      const result = await getCachedPost('post-1');

      expect(result?.post.id).toBe('post-1');
      expect(result?.post.categories).toHaveLength(1);
      expect(result?.post.tags).toHaveLength(1);
      expect(result?.relatedPosts).toHaveLength(1);
      expect(result?.relatedPosts[0].id).toBe('post-2');
    });

    it('should return null if post not found', async () => {
      dbMock._setResolvedValue([]);
      const result = await getCachedPost('ghost');
      expect(result).toBeNull();
    });
  });

  describe('getCachedPage', () => {
    it('should return page if found', async () => {
      dbMock._setResolvedValue([{ id: 'p1', type: 'page', title: 'Page 1' }]);
      const result = await getCachedPage('p1');
      expect(result?.id).toBe('p1');
    });

    it('should return null if not found', async () => {
      dbMock._setResolvedValue([]);
      const result = await getCachedPage('ghost');
      expect(result).toBeNull();
    });
  });

  describe('getCachedTaxonomyPosts', () => {
    it('should return null if term not found', async () => {
      dbMock._setResolvedValue([]);
      const result = await getCachedTaxonomyPosts('ghost', 'category', 10, 0);
      expect(result).toBeNull();
    });

    it('should return total and posts if term found', async () => {
      dbMock._setResolvedValue([{ id: 't1', slug: 'news' }]); // Term
      dbMock._setResolvedValue([{ value: 5 }]); // Total count
      dbMock._setResolvedValue([{ id: 'p1', title: 'Post 1' }]); // Posts
      dbMock._setResolvedValue([{ id: 'c1', name: 'News', slug: 'news' }]); // Hydrate categories

      const result = await getCachedTaxonomyPosts('news', 'category', 10, 0);
      expect(result?.total).toBe(5);
      expect(result?.term.id).toBe('t1');
      expect(result?.hydratedPosts).toHaveLength(1);
    });
  });

  describe('getCachedArchivePosts', () => {
    it('should return total count and hydrated posts', async () => {
      dbMock._setResolvedValue([{ value: 10 }]);
      dbMock._setResolvedValue([{ id: 'p1', title: 'P1' }]);
      dbMock._setResolvedValue([{ id: 'c1', name: 'C1' }]);

      const result = await getCachedArchivePosts(10, 0);
      expect(result.total).toBe(10);
      expect(result.hydratedPosts).toHaveLength(1);
    });
  });

  describe('getCachedSearchResults', () => {
    it('should return search results', async () => {
      dbMock._setResolvedValue([{ value: 2 }]); // count
      dbMock._setResolvedValue([{ id: 'p1', title: 'Test Search' }]); // posts
      dbMock._setResolvedValue([]); // hydrate

      const result = await getCachedSearchResults('Test', 10, 0);
      expect(result.total).toBe(2);
      expect(result.hydratedPosts).toHaveLength(1);
    });
  });

  describe('getCachedMetadata', () => {
    it('should return term metadata', async () => {
      dbMock._setResolvedValue([{ name: 'News Term', description: 'Term desc' }]);
      const result = await getCachedMetadata('category/news', 'category', 'news');
      expect(result?.title).toBe('News Term');
      expect(result?.description).toBe('Term desc');
    });

    it('should return post metadata without explicit excerpt', async () => {
      dbMock._setResolvedValue([{ 
        id: 'p1', 
        title: 'Post Title', 
        excerpt: null, 
        content: '<p>Long content string that needs to be truncated for the description field</p>', 
        type: 'post', 
        createdAt: new Date('2023-01-01') 
      }]);
      dbMock._setResolvedValue([{ name: 'News', taxonomy: 'category' }, { name: 'Hot', taxonomy: 'tag' }]);

      const result = await getCachedMetadata('p1', 'p1');
      expect(result?.title).toBe('Post Title');
      expect(result?.section).toBe('News');
      expect(result?.tags).toBe('Hot');
    });

    it('should return archive metadata', async () => {
      const result = await getCachedMetadata('archive', 'archive');
      expect(result?.title).toBe('All Articles');
    });

    it('should return null if nothing matches', async () => {
      dbMock._setResolvedValue([]);
      const result = await getCachedMetadata('ghost', 'ghost');
      expect(result).toBeNull();
    });
  });

  describe('getLatestPosts', () => {
    it('should return latest hydrated posts', async () => {
      dbMock._setResolvedValue([{ id: 'p1', title: 'P1' }]);
      dbMock._setResolvedValue([]); // hydrate

      const result = await getLatestPosts(5);
      expect(result).toHaveLength(1);
    });
  });

  describe('getCachedPostById', () => {
    it('should return post by id', async () => {
      dbMock._setResolvedValue([{ id: 'p1', title: 'P1' }]);
      dbMock._setResolvedValue([]); // hydrate

      const result = await getCachedPostById('p1');
      expect(result?.id).toBe('p1');
    });

    it('should return null if not found', async () => {
      dbMock._setResolvedValue([]);
      const result = await getCachedPostById('p1');
      expect(result).toBeNull();
    });
  });
});
