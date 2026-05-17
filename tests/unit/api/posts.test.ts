import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/posts/route';
import { dbMock } from '@/tests/mocks/db';
import { getAuthorizedUser } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

vi.mock('@/lib/api-auth', () => ({
  getAuthorizedUser: vi.fn(),
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({ data, ...init })),
  },
}));

describe('API: /api/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if unauthorized', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce(null);
      const req = new Request('http://localhost:3000/api/posts');
      const res: any = await GET(req);
      expect(res.status).toBe(401);
    });

    it('should return posts if authorized', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1', role: 'user', email: 'u1@ex.com', name: 'U1' });
      dbMock._setResolvedValue([{ id: 'p1', title: 'Post 1' }]); // items
      dbMock._setResolvedValue([{ count: 1 }]); // total

      const req = new Request('http://localhost:3000/api/posts');
      const res: any = await GET(req);
      
      expect(res.data.items).toHaveLength(1);
      expect(res.data.total).toBe(1);
    });
  });

  describe('POST', () => {
    it('should create a post', async () => {
      vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1', role: 'user', email: 'u1@ex.com', name: 'U1' });
      dbMock._setResolvedValue([{ id: 'new-p1', title: 'New Post' }]); // insert returning

      const req = new Request('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Post' }),
      });

      const res: any = await POST(req);
      expect(res.data.success).toBe(true);
      expect(dbMock.insert).toHaveBeenCalled();
    });
  });
});
