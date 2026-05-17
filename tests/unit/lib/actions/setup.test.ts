import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkInitialized, bootstrapDatabase } from '@/lib/actions/setup';
import { dbMock } from '@/tests/mocks/db';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import { redirect } from 'next/navigation';

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => ({
    query: vi.fn().mockResolvedValue({}),
  })),
}));

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn().mockReturnValue('CREATE TABLE test;'),
  },
}));

// Note: next/navigation is already mocked in tests/setup.ts to throw on redirect

describe('Setup Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkInitialized', () => {
    it('should return true if is_initialized is true', async () => {
      dbMock._setResolvedValue([{ key: 'is_initialized', value: 'true' }]);
      const result = await checkInitialized();
      expect(result).toBe(true);
    });

    it('should return false if is_initialized is not found', async () => {
      dbMock._setResolvedValue([]);
      const result = await checkInitialized();
      expect(result).toBe(false);
    });

    it('should return false if database table does not exist', async () => {
      dbMock._setRejectedValue(new Error('relation "options" does not exist'));
      const result = await checkInitialized();
      expect(result).toBe(false);
    });
  });

  describe('bootstrapDatabase', () => {
    it('should throw if required fields missing', async () => {
      const formData = new FormData();
      await expect(bootstrapDatabase(formData)).rejects.toThrow('Site Title and Tagline are required.');
    });

    it('should proceed with bootstrap if not initialized', async () => {
      const formData = new FormData();
      formData.append('siteTitle', 'My CMS');
      formData.append('siteTagline', 'Fast CMS');

      // 1. Check if initialized (returns empty)
      dbMock._setResolvedValue([]);
      
      // Should throw NEXT_REDIRECT at the end
      await expect(bootstrapDatabase(formData)).rejects.toThrow('NEXT_REDIRECT');

      expect(neon).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/login');
    });

    it('should redirect to login if already initialized', async () => {
      const formData = new FormData();
      formData.append('siteTitle', 'My CMS');
      formData.append('siteTagline', 'Fast CMS');

      // 1. Check if initialized (returns true)
      dbMock._setResolvedValue([{ value: 'true' }]);
      
      await expect(bootstrapDatabase(formData)).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/login');
      expect(neon).not.toHaveBeenCalled();
    });
  });
});
