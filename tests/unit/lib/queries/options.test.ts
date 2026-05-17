import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedOption, getCachedOptions } from '@/lib/queries/options';
import { dbMock } from '@/tests/mocks/db';

describe('Option Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCachedOption', () => {
    it('should return option value if found', async () => {
      dbMock._setResolvedValue([{ value: 'Merpati CMS' }]);

      const result = await getCachedOption('site_name');
      expect(result).toBe('Merpati CMS');
      expect(dbMock.select).toHaveBeenCalled();
    });

    it('should return null if option not found', async () => {
      dbMock._setResolvedValue([]);

      const result = await getCachedOption('non_existent');
      expect(result).toBeNull();
    });

    it('should return null if relation does not exist (uninitialized)', async () => {
      const error = new Error('relation "options" does not exist');
      (error as any).code = '42P01';
      dbMock._setRejectedValue(error);

      const result = await getCachedOption('site_name');
      expect(result).toBeNull();
    });

    it('should throw other errors', async () => {
      const error = new Error('Connection failed');
      dbMock._setRejectedValue(error);

      await expect(getCachedOption('site_name')).rejects.toThrow('Connection failed');
    });
  });

  describe('getCachedOptions', () => {
    it('should return a record of options', async () => {
      dbMock._setResolvedValue([
        { key: 'site_name', value: 'Merpati CMS' },
        { key: 'site_description', value: 'Lightweight CMS' },
      ]);

      const result = await getCachedOptions(['site_name', 'site_description']);
      expect(result).toEqual({
        site_name: 'Merpati CMS',
        site_description: 'Lightweight CMS',
      });
    });

    it('should return empty object if no options found', async () => {
      dbMock._setResolvedValue([]);
      const result = await getCachedOptions(['a', 'b']);
      expect(result).toEqual({});
    });

    it('should return empty object if table does not exist', async () => {
      const error = new Error('relation "options" does not exist');
      (error as any).code = '42P01';
      dbMock._setRejectedValue(error);

      const result = await getCachedOptions(['site_name']);
      expect(result).toEqual({});
    });
  });
});
