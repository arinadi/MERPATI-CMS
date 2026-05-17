import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadMedia, getMedia, updateMedia, deleteMedia } from '@/lib/actions/media';
import { dbMock } from '@/tests/mocks/db';
import { auth } from '@/auth';
import { put, del } from '@vercel/blob';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@vercel/blob', () => ({
  put: vi.fn().mockResolvedValue({ url: 'https://blob.com/img.jpg' }),
  del: vi.fn().mockResolvedValue({}),
}));

describe('Media Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadMedia', () => {
    it('should return error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await uploadMedia(new FormData());
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return error if no file provided', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const result = await uploadMedia(new FormData());
      expect(result.error).toBe('No file provided');
    });

    it('should reject non-image files', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const formData = new FormData();
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      formData.append('file', file);

      const result = await uploadMedia(formData);
      expect(result.error).toBe('Only image files are allowed');
    });

    it('should reject files larger than 5MB', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const formData = new FormData();
      // create a mock file with a large size property
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
      formData.append('file', file);

      const result = await uploadMedia(formData);
      expect(result.error).toBe('File size exceeds 5MB limit');
    });

    it('should upload image and save to DB', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      
      const formData = new FormData();
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);

      dbMock._setResolvedValue([{ id: 'm1', url: 'https://blob.com/img.jpg' }]);

      const result = await uploadMedia(formData);
      
      expect(put).toHaveBeenCalled();
      expect(dbMock.insert).toHaveBeenCalled();
      expect(result.media).toBeDefined();
    });

    it('should return error if upload/db fails', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      const formData = new FormData();
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', file);

      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await uploadMedia(formData);
      expect(result.error).toBe('Failed to upload file to Blob store');
    });
  });

  describe('getMedia', () => {
    it('should return error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await getMedia();
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return media items', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([{ id: 'm1', url: 'http://test.com/img.jpg' }]);

      const result = await getMedia();
      expect(result.items).toHaveLength(1);
    });

    it('should return error if db fails', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await getMedia();
      expect(result.error).toBe('Failed to fetch media');
    });
  });

  describe('updateMedia', () => {
    it('should return error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await updateMedia('m1', 'alt text');
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should update media alt text', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([{ id: 'm1', altText: 'new alt' }]);

      const result = await updateMedia('m1', 'new alt');
      expect(result.media?.altText).toBe('new alt');
    });

    it('should return error if media not found', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([]);

      const result = await updateMedia('m1', 'new alt');
      expect(result.error).toBe('Media not found');
    });

    it('should return error if db fails', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await updateMedia('m1', 'new alt');
      expect(result.error).toBe('Failed to update media attributes');
    });
  });

  describe('deleteMedia', () => {
    it('should return error if not authorized', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce(null);
      const result = await deleteMedia('m1');
      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should delete from blob and DB', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([{ id: 'm1', url: 'https://blob.com/img.jpg' }]);
      dbMock._setResolvedValue({ success: true });

      const result = await deleteMedia('m1');
      
      expect(del).toHaveBeenCalledWith('https://blob.com/img.jpg');
      expect(dbMock.delete).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should return error if media not found', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setResolvedValue([]); // Not found
      const result = await deleteMedia('m1');
      expect(result.error).toBe('Media not found');
    });

    it('should return error if db fails', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { id: 'u1' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));

      const result = await deleteMedia('m1');
      expect(result.error).toBe('Failed to delete media');
    });
  });
});
