import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createToken, getTokens, revokeToken } from '@/lib/actions/tokens';
import { dbMock } from '@/tests/mocks/db';
import { auth } from '@/auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Token Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createToken', () => {
    it('should generate a token and save it', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([{ id: 't1', name: 'Dev', expiresAt: null }]);

      const result = await createToken('Dev');
      
      expect(result.token).toMatch(/^mc_/);
      expect(dbMock.insert).toHaveBeenCalled();
    });

    it('should throw error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      await expect(createToken('Dev')).rejects.toThrow('Unauthorized');
    });

    it('should throw specific error if table does not exist', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const error = new Error('relation "personal_access_tokens" does not exist');
      (error as any).code = '42P01';
      dbMock._setRejectedValue(error);

      await expect(createToken('Dev')).rejects.toThrow('Database not updated');
    });

    it('should throw generic error if db throws', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('Generic DB Error'));

      await expect(createToken('Dev')).rejects.toThrow('Generic DB Error');
    });
  });

  describe('getTokens', () => {
    it('should throw error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      await expect(getTokens()).rejects.toThrow('Unauthorized');
    });

    it('should return users tokens', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([{ id: 't1', name: 'Dev' }]);

      const result = await getTokens();
      expect(result).toHaveLength(1);
    });

    it('should return empty array if table does not exist', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const error = new Error('relation "personal_access_tokens" does not exist');
      (error as any).code = '42P01';
      dbMock._setRejectedValue(error);

      const result = await getTokens();
      expect(result).toEqual([]);
    });

    it('should throw generic error if db throws', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('Generic DB Error'));

      await expect(getTokens()).rejects.toThrow('Generic DB Error');
    });
  });

  describe('revokeToken', () => {
    it('should throw error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      await expect(revokeToken('t1')).rejects.toThrow('Unauthorized');
    });

    it('should delete the token', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue({ success: true });

      const result = await revokeToken('t1');
      expect(result.success).toBe(true);
      expect(dbMock.delete).toHaveBeenCalled();
    });
  });
});
