import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getOption, getOptions, setOption, setOptions } from '@/lib/actions/options';
import { dbMock } from '@/tests/mocks/db';
import { checkRole } from '@/lib/rbac';
import { revalidatePath, revalidateTag } from 'next/cache';

vi.mock('@/lib/rbac', () => ({
  checkRole: vi.fn(),
}));

describe('Options Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOption', () => {
    it('should return value if option exists', async () => {
      dbMock._setResolvedValue([{ value: 'test-value' }]);
      const result = await getOption('site_name');
      expect(result).toBe('test-value');
    });

    it('should return null if option does not exist', async () => {
      dbMock._setResolvedValue([]);
      const result = await getOption('non_existent');
      expect(result).toBeNull();
    });

    it('should return null if table does not exist', async () => {
      const error = new Error('relation "options" does not exist');
      (error as any).code = '42P01';
      dbMock._setRejectedValue(error);
      const result = await getOption('any');
      expect(result).toBeNull();
    });

    it('should return null and warn on generic db error', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      dbMock._setRejectedValue(new Error('Generic DB Error'));
      const result = await getOption('any');
      expect(result).toBeNull();
      spy.mockRestore();
    });
  });

  describe('getOptions', () => {
    it('should return record of options', async () => {
      dbMock._setResolvedValue([
        { key: 'o1', value: 'v1' },
        { key: 'o2', value: 'v2' },
      ]);
      const result = await getOptions(['o1', 'o2']);
      expect(result).toEqual({ o1: 'v1', o2: 'v2' });
    });

    it('should return empty object if table does not exist', async () => {
      const error = new Error('relation "options" does not exist');
      (error as any).code = '42P01';
      dbMock._setRejectedValue(error);
      const result = await getOptions(['any']);
      expect(result).toEqual({});
    });

    it('should return empty object and warn on generic db error', async () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      dbMock._setRejectedValue(new Error('Generic DB Error'));
      const result = await getOptions(['any']);
      expect(result).toEqual({});
      spy.mockRestore();
    });
  });

  describe('setOption', () => {
    it('should allow super_user to set option', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true });

      const result = await setOption('key', 'val');
      expect(result.success).toBe(true);
      expect(dbMock.insert).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalledWith('site-options', 'default');
    });

    it('should return error if unauthorized', async () => {
      vi.mocked(checkRole).mockRejectedValueOnce(new Error('Unauthorized'));
      const result = await setOption('key', 'val');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('setOptions', () => {
    it('should set multiple options', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true });

      const result = await setOptions({ k1: 'v1', k2: 'v2' });
      expect(result.success).toBe(true);
      expect(dbMock.insert).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await setOptions({ k1: 'v1' });
      expect(result.success).toBe(false);
      expect(result.error).toBe('DB Error');
      spy.mockRestore();
    });
  });
});
