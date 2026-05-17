import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getPosts, 
  getPostById,
  getPostBySlug,
  searchPublishedPosts,
  createPost, 
  updatePost, 
  deletePost, 
  bulkActionPosts 
} from '@/lib/actions/posts';
import { dbMock } from '@/tests/mocks/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { sendTelegramAlert } from '@/lib/notifications/telegram';
import { getOption } from '@/lib/actions/options';

// Mock dependencies
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/actions/terms', () => ({
  syncPostTerms: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/notifications/telegram', () => ({
  sendTelegramAlert: vi.fn(),
}));

vi.mock('@/lib/actions/options', () => ({
  getOption: vi.fn().mockResolvedValue('true'),
}));

describe('Post Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should fetch posts with pagination and count', async () => {
      // Mock items query result
      dbMock._setResolvedValue([
        { id: '1', title: 'Post 1', slug: 'post-1' },
        { id: '2', title: 'Post 2', slug: 'post-2' },
      ]);
      // Mock count query result
      dbMock._setResolvedValue([{ count: 2 }]);

      const result = await getPosts('post', 1, 20);

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(dbMock.select).toHaveBeenCalled();
    });

    it('should apply search filters correctly', async () => {
      dbMock._setResolvedValue([]); // items
      dbMock._setResolvedValue([{ count: 0 }]); // total

      await getPosts('post', 1, 20, 'hello', 'published', 'title', 'asc');
      
      expect(dbMock.select).toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('should return post with relations if found', async () => {
      dbMock._setResolvedValue([{ id: 'p1', title: 'P1' }]); // post
      dbMock._setResolvedValue([{ id: 'r1', title: 'R1' }]); // related
      dbMock._setResolvedValue([{ id: 't1', taxonomy: 'category' }]); // terms

      const result = await getPostById('p1');
      expect(result.post?.id).toBe('p1');
    });

    it('should return error if not found', async () => {
      dbMock._setResolvedValue([]); // post
      const result = await getPostById('p1');
      expect(result.error).toBe('Post not found.');
    });

    it('should return error if db throws', async () => {
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await getPostById('p1');
      expect(result.error).toBe('Failed to fetch post.');
    });
  });

  describe('getPostBySlug', () => {
    it('should return error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await getPostBySlug('p1');
      expect(result.error).toBe('Unauthorized');
    });

    it('should return post with relations if found', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([{ id: 'p1', title: 'P1' }]); // post
      dbMock._setResolvedValue([{ id: 'r1', title: 'R1' }]); // related
      dbMock._setResolvedValue([{ id: 't1', taxonomy: 'category' }]); // terms

      const result = await getPostBySlug('p1');
      expect(result.post?.id).toBe('p1');
    });

    it('should return error if not found', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([]); // post
      const result = await getPostBySlug('p1');
      expect(result.error).toBe('Post not found.');
    });

    it('should return error if db throws', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await getPostBySlug('p1');
      expect(result.error).toBe('Failed to fetch post.');
    });
  });

  describe('searchPublishedPosts', () => {
    it('should return search results', async () => {
      dbMock._setResolvedValue([{ id: 'p1', title: 'P1' }]);
      const result = await searchPublishedPosts('test', 'exclude-id');
      expect(result).toHaveLength(1);
    });
  });

  describe('createPost', () => {
    it('should return unauthorized if no session', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await createPost({ title: 'New Post' });
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should validate required fields', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      const result = await createPost({ title: '' }); // Empty title fails zod validation
      expect(result.error).toBeDefined();
    });

    it('should create a page, sync related, and return success', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      
      // Mock slug uniqueness check (not found)
      dbMock._setResolvedValue([]); 
      
      // Mock insert returning id
      dbMock._setResolvedValue([{ id: 'new-id' }]);
      
      // Mock insert related
      dbMock._setResolvedValue({ success: true });

      const result = await createPost({ 
        title: 'New Page', 
        content: '<p>Hello world</p>',
        status: 'published',
        type: 'page',
        relatedPostIds: ['r1'],
        termIds: ['t1']
      });

      expect(result).toEqual({ success: true, id: 'new-id', slug: 'new-page' });
      expect(dbMock.insert).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/pages');
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });

    it('should append timestamp to slug if conflict exists', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      
      // Mock slug conflict
      dbMock._setResolvedValue([{ id: 'existing-id' }]); 
      
      // Mock insert
      dbMock._setResolvedValue([{ id: 'new-id' }]);

      const result = await createPost({ title: 'New Post' });
      
      expect(result.success).toBe(true);
      expect(result.slug).toMatch(/^new-post-\d+$/);
    });
  });

  describe('updatePost', () => {
    it('should return unauthorized if no session', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await updatePost('1', { title: 'Updated' });
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return error if post not found', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock._setResolvedValue([]); // Post not found
      const result = await updatePost('1', { title: 'Updated' });
      expect(result).toEqual({ error: 'Post not found' });
    });

    it('should update post, sync related, and notify if status changes to published', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock._setResolvedValue([{ id: '1', type: 'post', status: 'draft', slug: 'old', title: 'Old' }]); // Found
      dbMock._setResolvedValue([]); // No slug conflict
      dbMock._setResolvedValue({ success: true }); // Update success
      dbMock._setResolvedValue({ success: true }); // delete related
      dbMock._setResolvedValue({ success: true }); // insert related

      const result = await updatePost('1', { 
        title: 'New Title', 
        status: 'published', 
        content: 'content', 
        excerpt: ' ', // empty excerpt triggers auto-fill
        featuredImage: 'img.jpg',
        relatedPostIds: ['r1'],
        termIds: ['t1']
      });
      
      expect(result).toEqual({ success: true });
      expect(dbMock.update).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalled();
      expect(sendTelegramAlert).toHaveBeenCalled();
    });

    it('should return error if slug conflict exists', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock.then.mockRestore(); // Clear queue
      dbMock.then.mockImplementation((onfulfilled: any) => Promise.resolve([]).then(onfulfilled));
      dbMock._setResolvedValue([{ id: '1', type: 'post' }]); // Found
      dbMock._setResolvedValue([{ id: '2' }]); // Conflict found

      const result = await updatePost('1', { slug: 'conflict-slug' });
      expect(result).toEqual({ error: 'Slug is already in use' });
    });
  });

  describe('deletePost', () => {
    it('should delete post if authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock._setResolvedValue([{ id: '1', type: 'post' }]); // Found
      dbMock._setResolvedValue({ success: true }); // Delete success

      const result = await deletePost('1');
      expect(result).toEqual({ success: true });
      expect(dbMock.delete).toHaveBeenCalled();
    });

    it('should return error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await deletePost('1');
      expect(result.error).toBe('Unauthorized');
    });

    it('should return error if post not found', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock.then.mockRestore(); // Clear queue
      dbMock.then.mockImplementation((onfulfilled: any) => Promise.resolve([]).then(onfulfilled));
      dbMock._setResolvedValue([]); // Not found
      const result = await deletePost('1');
      expect(result).toEqual({ error: 'Post not found' });
    });
  });

  describe('bulkActionPosts', () => {
    it('should perform bulk delete', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock.then.mockRestore(); // Clear queue
      dbMock.then.mockImplementation((onfulfilled: any) => Promise.resolve([]).then(onfulfilled));
      dbMock._setResolvedValue({ success: true });

      const result = await bulkActionPosts(['1', '2'], 'delete');
      expect(result).toEqual({ success: true });
      expect(dbMock.delete).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/posts');
    });

    it('should perform bulk publish', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock._setResolvedValue({ success: true });

      const result = await bulkActionPosts(['1', '2'], 'publish');
      expect(result).toEqual({ success: true });
      expect(dbMock.update).toHaveBeenCalled();
    });

    it('should return error if unauthorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await bulkActionPosts(['1'], 'delete');
      expect(result.error).toBe('Unauthorized');
    });

    it('should return error if no IDs provided', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      const result = await bulkActionPosts([], 'delete');
      expect(result).toEqual({ error: 'No items selected' });
    });

    it('should return error if invalid action', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      const result = await bulkActionPosts(['1'], 'invalid' as any);
      expect(result.error).toBe('Invalid action');
    });

    it('should return error if db throws', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'user-1' }, expires: '' });
      dbMock.then.mockRestore(); // Clear queue
      dbMock.then.mockImplementation((onfulfilled: any) => Promise.resolve([]).then(onfulfilled));
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await bulkActionPosts(['1'], 'delete');
      expect(result.error).toBe('An error occurred during bulk operation');
    });
  });
});
