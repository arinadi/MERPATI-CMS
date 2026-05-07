import { describe, it, expect, vi } from 'vitest';
import { checkRole, isSuperUser } from '@/lib/rbac';
import { auth } from '@/auth';

// Mock the auth module
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('RBAC Utilities', () => {
  describe('isSuperUser', () => {
    it('should return true for super_user role', () => {
      expect(isSuperUser('super_user')).toBe(true);
    });

    it('should return false for other roles', () => {
      expect(isSuperUser('user')).toBe(false);
      expect(isSuperUser('admin')).toBe(false);
      expect(isSuperUser('')).toBe(false);
      expect(isSuperUser(null)).toBe(false);
      expect(isSuperUser(undefined)).toBe(false);
    });
  });

  describe('checkRole', () => {
    it('should throw error if not authenticated', async () => {
      vi.mocked(auth).mockResolvedValueOnce(null);
      await expect(checkRole(['super_user'])).rejects.toThrow('Unauthorized: Not authenticated.');
    });

    it('should throw error if user has insufficient permissions', async () => {
      vi.mocked(auth).mockResolvedValueOnce({
        user: { role: 'user', email: 'test@example.com' },
        expires: '',
      });
      await expect(checkRole(['super_user'])).rejects.toThrow('Forbidden: Insufficient permissions.');
    });

    it('should return session if user has allowed role', async () => {
      const mockSession = {
        user: { role: 'super_user', email: 'test@example.com' },
        expires: '',
      };
      vi.mocked(auth).mockResolvedValueOnce(mockSession);
      const result = await checkRole(['super_user']);
      expect(result).toEqual(mockSession);
    });

    it('should allow user if they have one of the multiple allowed roles', async () => {
      const mockSession = {
        user: { role: 'user', email: 'test@example.com' },
        expires: '',
      };
      vi.mocked(auth).mockResolvedValueOnce(mockSession);
      const result = await checkRole(['super_user', 'user']);
      expect(result).toEqual(mockSession);
    });
  });
});
