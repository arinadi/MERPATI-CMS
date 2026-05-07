import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTerms, createTerm, updateTerm, deleteTerm, syncPostTerms } from '@/lib/actions/terms';
import { dbMock } from '@/tests/mocks/db';
import { checkRole } from '@/lib/rbac';

vi.mock('@/lib/rbac', () => ({
  checkRole: vi.fn(),
}));

describe('Terms Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTerms', () => {
    it('should return terms for a taxonomy', async () => {
      dbMock._setResolvedValue([{ id: '1', name: 'Cat 1' }]);
      const result = await getTerms('category');
      expect(result.terms).toHaveLength(1);
    });

    it('should return error if db throws', async () => {
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await getTerms('category');
      expect(result.error).toBe('Failed to fetch categorys.');
    });
  });

  describe('createTerm', () => {
    it('should create a new term', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([]); // No slug conflict
      dbMock._setResolvedValue([{ id: 'new-t1', name: 'New Term' }]); // insert

      const result = await createTerm({ name: 'New Term', taxonomy: 'category' });
      expect(result.term).toBeDefined();
      expect(dbMock.insert).toHaveBeenCalled();
    });

    it('should return error if invalid data provided', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      const result = await createTerm({ name: '', taxonomy: 'category' } as any);
      expect(result.error).toBe('Invalid data provided.');
    });

    it('should return error if slug already exists', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([{ id: 'existing-id' }]); // Conflict

      const result = await createTerm({ name: 'Conflict', slug: 'conflict', taxonomy: 'tag' });
      expect(result.error).toBe('Slug already exists. Please choose a different one.');
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await createTerm({ name: 'Valid', taxonomy: 'category' });
      expect(result.error).toBe('DB Error');
    });
  });

  describe('updateTerm', () => {
    it('should update term successfully', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([]); // no conflict
      dbMock._setResolvedValue([{ id: 't1', name: 'Updated' }]); // update

      const result = await updateTerm('t1', { name: 'Updated', slug: 'new-slug', parentId: 'p1', description: 'desc' });
      expect(result.term).toBeDefined();
      expect(dbMock.update).toHaveBeenCalled();
    });

    it('should return error if slug already exists in another term', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([{ id: 't2' }]); // conflict found

      const result = await updateTerm('t1', { slug: 'conflict-slug' });
      expect(result.error).toBe('Slug already exists. Please choose a different one.');
    });

    it('should update term successfully if slug exists but belongs to same term', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([{ id: 't1' }]); // same id
      dbMock._setResolvedValue([{ id: 't1', slug: 'same-slug' }]); // update

      const result = await updateTerm('t1', { slug: 'same-slug' });
      expect(result.term).toBeDefined();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await updateTerm('t1', { name: 'Name' });
      expect(result.error).toBe('DB Error');
    });
  });

  describe('deleteTerm', () => {
    it('should delete a term', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true });
      const result = await deleteTerm('t1');
      expect(result.success).toBe(true);
      expect(dbMock.delete).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await deleteTerm('t1');
      expect(result.error).toBe('DB Error');
    });
  });

  describe('syncPostTerms', () => {
    it('should sync terms for a post', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true }); // delete
      dbMock._setResolvedValue({ success: true }); // insert

      const result = await syncPostTerms('post-1', ['term-1', 'term-2']);
      expect(result.success).toBe(true);
      expect(dbMock.delete).toHaveBeenCalled();
      expect(dbMock.insert).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await syncPostTerms('post-1', ['term-1']);
      expect(result.error).toBe('DB Error');
    });
  });
});
