import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMenus, createMenu, updateMenu, deleteMenu, getMenuItems, saveMenuItems } from '@/lib/actions/menus';
import { dbMock } from '@/tests/mocks/db';
import { checkRole } from '@/lib/rbac';
import { revalidatePath } from 'next/cache';

vi.mock('@/lib/rbac', () => ({
  checkRole: vi.fn(),
}));

describe('Menu Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMenus', () => {
    it('should return all menus', async () => {
      dbMock._setResolvedValue([{ id: 'm1', name: 'Main' }]);
      const result = await getMenus();
      expect(result).toHaveLength(1);
    });
  });

  describe('createMenu', () => {
    it('should allow super_user to create menu', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([{ id: 'm1', name: 'Main' }]);

      const result = await createMenu('Main', 'main');
      expect(result.success).toBe(true);
      expect(dbMock.insert).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/menus');
    });

    it('should return error if unauthorized or db throws', async () => {
      vi.mocked(checkRole).mockRejectedValueOnce(new Error('Unauthorized'));
      const result = await createMenu('Main', 'main');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });

  describe('updateMenu', () => {
    it('should update a menu', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([{ id: 'm1', name: 'Main 2' }]);

      const result = await updateMenu('m1', 'Main 2', 'main-2');
      expect(result.success).toBe(true);
      expect(dbMock.update).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await updateMenu('m1', 'Main 2', 'main-2');
      expect(result.success).toBe(false);
      expect(result.error).toBe('DB Error');
    });
  });

  describe('deleteMenu', () => {
    it('should delete a menu', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true });

      const result = await deleteMenu('m1');
      expect(result.success).toBe(true);
      expect(dbMock.delete).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await deleteMenu('m1');
      expect(result.success).toBe(false);
      expect(result.error).toBe('DB Error');
    });
  });

  describe('getMenuItems', () => {
    it('should get menu items', async () => {
      dbMock._setResolvedValue([{ id: 'i1', title: 'Home' }]);
      const result = await getMenuItems('m1');
      expect(result).toHaveLength(1);
    });
  });

  describe('saveMenuItems', () => {
    it('should delete existing and insert new items', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true }); // delete
      dbMock._setResolvedValue({ success: true }); // insert

      const items = [{ title: 'Home', url: '/', type: 'custom' as const }];
      const result = await saveMenuItems('m1', items);

      expect(result.success).toBe(true);
      expect(dbMock.delete).toHaveBeenCalled();
      expect(dbMock.insert).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));

      const items = [{ title: 'Home', url: '/', type: 'custom' as const }];
      const result = await saveMenuItems('m1', items);

      expect(result.success).toBe(false);
      expect(result.error).toBe('DB Error');
    });
  });
});
