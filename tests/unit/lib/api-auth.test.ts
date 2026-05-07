import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateToken, getAuthorizedUser } from '@/lib/api-auth';
import { dbMock } from '@/tests/mocks/db';
import { headers } from 'next/headers';
import { auth } from '@/auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('API Auth Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateToken', () => {
    it('should return null if no Authorization header', async () => {
      vi.mocked(headers).mockResolvedValueOnce(new Map() as any);
      const result = await validateToken();
      expect(result).toBeNull();
    });

    it('should return null if header does not start with Bearer', async () => {
      const h = new Map([['authorization', 'Basic 123']]);
      vi.mocked(headers).mockResolvedValueOnce(h as any);
      const result = await validateToken();
      expect(result).toBeNull();
    });

    it('should return user if token is valid', async () => {
      const h = new Map([['authorization', 'Bearer valid-token']]);
      vi.mocked(headers).mockResolvedValueOnce(h as any);
      
      dbMock._setResolvedValue([{
        user: { id: '1', role: 'user', name: 'Test', email: 'test@example.com' },
        tokenId: 't1',
        expiresAt: null
      }]);

      const result = await validateToken();
      expect(result?.id).toBe('1');
      expect(dbMock.select).toHaveBeenCalled();
    });

    it('should return null if token not found', async () => {
      const h = new Map([['authorization', 'Bearer invalid-token']]);
      vi.mocked(headers).mockResolvedValueOnce(h as any);
      dbMock._setResolvedValue([]);

      const result = await validateToken();
      expect(result).toBeNull();
    });
  });

  describe('getAuthorizedUser', () => {
    it('should prefer token auth over session auth', async () => {
      // Mock valid token
      const h = new Map([['authorization', 'Bearer valid-token']]);
      vi.mocked(headers).mockResolvedValueOnce(h as any);
      dbMock._setResolvedValue([{
        user: { id: 'api-id', role: 'user', name: 'API', email: 'api@example.com' },
        tokenId: 't1'
      }]);

      const result = await getAuthorizedUser();
      expect(result?.id).toBe('api-id');
      expect(auth).not.toHaveBeenCalled();
    });

    it('should use session auth if token auth fails', async () => {
      // No token
      vi.mocked(headers).mockResolvedValueOnce(new Map() as any);
      // Valid session
      vi.mocked(auth).mockResolvedValueOnce({
        user: { id: 'session-id', role: 'user', name: 'Session', email: 'session@example.com' },
        expires: ''
      });

      const result = await getAuthorizedUser();
      expect(result?.id).toBe('session-id');
    });

    it('should return null if both fail', async () => {
      vi.mocked(headers).mockResolvedValueOnce(new Map() as any);
      vi.mocked(auth).mockResolvedValueOnce(null);

      const result = await getAuthorizedUser();
      expect(result).toBeNull();
    });
  });
});
