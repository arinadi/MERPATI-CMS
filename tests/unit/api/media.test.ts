import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/media/route';
import { dbMock } from '@/tests/mocks/db';
import { getAuthorizedUser } from '@/lib/api-auth';
import { put } from '@vercel/blob';

vi.mock('@/lib/api-auth', () => ({
  getAuthorizedUser: vi.fn(),
}));

vi.mock('@vercel/blob', () => ({
  put: vi.fn().mockResolvedValue({ url: 'http://blob.com/1.jpg' }),
}));

describe('API: /api/media', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload media if authorized', async () => {
    vi.mocked(getAuthorizedUser).mockResolvedValueOnce({ id: 'u1' } as any);
    dbMock._setResolvedValue([{ id: 'm1', url: 'http://blob.com/1.jpg', filename: 't.jpg' }]);

    const mockFile = {
      name: 't.jpg',
      type: 'image/jpeg',
      size: 100,
    };

    const mockFormData = {
      get: vi.fn().mockReturnValue(mockFile),
    };

    const mockReq = {
      formData: vi.fn().mockResolvedValue(mockFormData),
    } as any;

    const res: any = await POST(mockReq);

    expect(res.data.success).toBe(true);
    expect(put).toHaveBeenCalled();
    expect(dbMock.insert).toHaveBeenCalled();
  });

  it('should return 401 if unauthorized', async () => {
    vi.mocked(getAuthorizedUser).mockResolvedValueOnce(null);
    const res: any = await POST({} as any);
    expect(res.status).toBe(401);
  });
});
