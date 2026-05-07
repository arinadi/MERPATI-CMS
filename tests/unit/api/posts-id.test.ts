import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH, DELETE } from '@/app/api/posts/[id]/route';
import { dbMock } from '@/tests/mocks/db';
import { getAuthorizedUser } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

vi.mock('@/lib/api-auth', () => ({
  getAuthorizedUser: vi.fn(),
}));

describe('API: /api/posts/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return post if found', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1' } as any);
      dbMock._setResolvedValue([{ id: 'p1', title: 'Post 1' }]);

      const res: any = await GET(new Request('http://l'), { params: Promise.resolve({ id: 'p1' }) });
      expect(res.data.post.id).toBe('p1');
    });

    it('should return 404 if not found', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1' } as any);
      dbMock._setResolvedValue([]);

      const res: any = await GET(new Request('http://l'), { params: Promise.resolve({ id: 'none' }) });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH', () => {
    it('should update post', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1' } as any);
      dbMock._setResolvedValue([{ id: 'p1', title: 'Updated' }]);

      const req = new Request('http://l', { method: 'PATCH', body: JSON.stringify({ title: 'Updated' }) });
      const res: any = await PATCH(req, { params: Promise.resolve({ id: 'p1' }) });
      
      expect(res.data.success).toBe(true);
      expect(dbMock.update).toHaveBeenCalled();
    });
  });

  describe('DELETE', () => {
    it('should delete post', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1' } as any);
      dbMock._setResolvedValue({ success: true });

      const res: any = await DELETE(new Request('http://l'), { params: Promise.resolve({ id: 'p1' }) });
      expect(res.data.success).toBe(true);
      expect(dbMock.delete).toHaveBeenCalled();
    });
  });
});
