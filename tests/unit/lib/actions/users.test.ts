import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getUsers, 
  updateProfile, 
  updateUserRole, 
  updateUserStatus, 
  renameUser, 
  deleteUser, 
  inviteUser 
} from '@/lib/actions/users';
import { dbMock } from '@/tests/mocks/db';
import { auth } from '@/auth';
import { checkRole } from '@/lib/rbac';
import { revalidatePath } from 'next/cache';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/rbac', () => ({
  checkRole: vi.fn(),
}));

// Mock dynamic imports used in inviteUser
vi.mock('@/lib/actions/options', () => ({
  getOption: vi.fn().mockResolvedValue('true'),
}));

vi.mock('@/lib/notifications/telegram', () => ({
  sendTelegramAlert: vi.fn(),
}));

describe('User Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      dbMock._setResolvedValue([{ id: 'u1', name: 'User 1' }]);
      const result = await getUsers();
      expect(result).toHaveLength(1);
      expect(dbMock.select).toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update name for current user', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue({ success: true });
      
      const result = await updateProfile({ name: 'New Name' });
      expect(result).toEqual({ success: true });
      expect(dbMock.update).toHaveBeenCalled();
    });

    it('should return error if name is empty', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const result = await updateProfile({ name: '   ' });
      expect(result.error).toBe('Name cannot be empty');
    });

    it('should return error if db throws', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await updateProfile({ name: 'Valid Name' });
      expect(result.error).toBe('Failed to update profile');
    });
  });

  describe('updateUserRole', () => {
    it('should allow super_user to update role', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({ user: { role: 'super_user' } } as any);
      dbMock._setResolvedValue({ success: true });

      const result = await updateUserRole('u2', 'super_user');
      expect(result).toEqual({ success: true });
      expect(revalidatePath).toHaveBeenCalledWith('/admin/users');
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await updateUserRole('u2', 'super_user');
      expect(result.error).toBe('Failed to update role');
    });
  });

  describe('updateUserStatus', () => {
    it('should allow super_user to update status', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true });
      const result = await updateUserStatus('u2', 'suspended');
      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/users');
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await updateUserStatus('u2', 'suspended');
      expect(result.error).toBe('Failed to update status');
    });
  });

  describe('renameUser', () => {
    it('should rename user if super_user and name is valid', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue({ success: true });
      const result = await renameUser('u2', 'New Name');
      expect(result.success).toBe(true);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/users');
    });

    it('should return error if name is empty', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      const result = await renameUser('u2', '');
      expect(result.error).toBe('Name cannot be empty');
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await renameUser('u2', 'New Name');
      expect(result.error).toBe('Failed to rename user');
    });
  });

  describe('deleteUser', () => {
    it('should prevent self-deletion', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });

      const result = await deleteUser('u1');
      expect(result.error).toBe('You cannot delete your own account.');
    });

    it('should delete other user', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue({ success: true });

      const result = await deleteUser('u2');
      expect(result).toEqual({ success: true });
      expect(dbMock.delete).toHaveBeenCalled();
    });

    it('should return error if db throws', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await deleteUser('u2');
      expect(result.error).toBe('Failed to delete user');
    });
  });

  describe('inviteUser', () => {
    it('should return error if email is invalid', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      const formData = new FormData();
      formData.append('email', 'not-an-email');
      
      const result = await inviteUser(formData);
      expect(result.error).toBe('Please enter a valid email address.');
    });

    it('should return error if user already exists', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([{ id: 'u1' }]); // Check user exists
      
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      const result = await inviteUser(formData);
      expect(result.error).toBe('A user with this email already exists.');
    });

    it('should return error if invitation already exists', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([]); // Check user exists (empty)
      dbMock._setResolvedValue([{ id: 'inv1' }]); // Check invite exists
      
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      const result = await inviteUser(formData);
      expect(result.error).toBe('An invitation for this email already exists.');
    });

    it('should successfully invite user and trigger telegram if configured', async () => {
      vi.mocked(checkRole).mockResolvedValueOnce({} as any);
      dbMock._setResolvedValue([]); // Check user exists
      dbMock._setResolvedValue([]); // Check invite exists
      dbMock._setResolvedValue([{ id: 'new-inv' }]); // Insert

      // Note: getOption('telegram_notify_user') is mocked to return 'true' globally
      
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      const result = await inviteUser(formData);
      
      expect(result.success).toBe(true);
      expect(dbMock.insert).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/users');
    });
  });
});
