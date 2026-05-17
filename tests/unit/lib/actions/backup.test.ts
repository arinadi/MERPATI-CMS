import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  generateDatabaseBackup, 
  runCronBackup, 
  runBackupAndNotify,
  runMediaBackupAndNotify,
  runWeeklyMediaBackup
} from '@/lib/actions/backup';
import { dbMock } from '@/tests/mocks/db';
import { auth } from '@/auth';
import { sendTelegramDocument } from '@/lib/notifications/telegram';
import { getCachedOptions } from '@/lib/queries/options';
import archiver from 'archiver';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('@/lib/notifications/telegram', () => ({
  sendTelegramDocument: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/queries/options', () => ({
  getCachedOptions: vi.fn(),
}));

vi.mock('archiver', () => {
  return {
    default: vi.fn().mockReturnValue({
      pipe: vi.fn(),
      append: vi.fn(),
      finalize: vi.fn().mockImplementation(function(this: any) {
        // Emit end on passthrough immediately when finalized
        setTimeout(() => this.passthrough?.emit('end'), 10);
        return Promise.resolve();
      }),
    }),
  };
});

describe('Backup Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    });
  });

  describe('generateDatabaseBackup', () => {
    it('should return SQL content for super_user with multiple types', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      
      // Mock db.select().from() for 11 tables
      dbMock._setResolvedValue([
        { id: 1, title: 'Data', active: true, date: new Date('2023-01-01'), meta: { k: 'v' }, empty: null }
      ]); // table 1
      for (let i = 1; i < 11; i++) {
        dbMock._setResolvedValue([]);
      }

      const result = await generateDatabaseBackup();
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.content).toContain('INSERT INTO');
        expect(result.content).toContain("'Data'"); // string
        expect(result.content).toContain("1"); // number
        expect(result.content).toContain("true"); // boolean
        expect(result.content).toContain("NULL"); // null
        expect(result.filename).toMatch(/^backup-/);
      }
    });

    it('should throw if not super_user', async () => {
      vi.mocked(auth as any).mockResolvedValueOnce({ user: { role: 'user' }, expires: '' });
      await expect(generateDatabaseBackup()).rejects.toThrow('Unauthorized');
    });

    it('should return error if db throws', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await generateDatabaseBackup();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toBe('DB Error');
    });
  });

  describe('runCronBackup', () => {
    it('should send backup if Telegram is configured', async () => {
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });

      for (let i = 0; i < 11; i++) {
        dbMock._setResolvedValue([]);
      }

      const result = await runCronBackup();
      
      expect(result.success).toBe(true);
      expect(sendTelegramDocument).toHaveBeenCalled();
    });

    it('should skip if Telegram not configured', async () => {
      vi.mocked(getCachedOptions).mockResolvedValueOnce({});
      const result = await runCronBackup();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toContain('Cron skipped');
    });

    it('should return error if it fails', async () => {
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });
      dbMock._setRejectedValue(new Error('DB Error'));
      const result = await runCronBackup();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toBe('DB Error');
    });
  });

  describe('runBackupAndNotify', () => {
    it('should send sql backup if super_user and telegram configured', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });

      for (let i = 0; i < 11; i++) {
        dbMock._setResolvedValue([]);
      }

      const result = await runBackupAndNotify();
      expect(result.success).toBe(true);
      expect(sendTelegramDocument).toHaveBeenCalled();
    });

    it('should return error if not super_user', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'user' }, expires: '' });
      await expect(runBackupAndNotify()).rejects.toThrow('Unauthorized');
    });

    it('should return error if telegram missing', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      vi.mocked(getCachedOptions).mockResolvedValue({});
      const result = await runBackupAndNotify();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toContain('Telegram Bot Token');
    });
  });

  describe('runMediaBackupAndNotify', () => {
    it('should send media zip if super_user and telegram configured', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });

      dbMock._setResolvedValue([{ id: 'm1', url: 'http://test.com/img.jpg', filename: 'img.jpg' }]);
      
      const archiverMock = (archiver as any)();
      // Setup a fake stream
      let streamCb: any;
      archiverMock.pipe.mockImplementation((s: any) => {
        archiverMock.passthrough = s;
        // mock writing empty chunk
        setTimeout(() => s.write(Buffer.from('zip data')), 5);
      });

      const result = await runMediaBackupAndNotify();
      expect(result.success).toBe(true);
      expect(sendTelegramDocument).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return error if no media found', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });
      dbMock._setResolvedValue([]);
      const result = await runMediaBackupAndNotify();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toBe('No media found to backup');
    });

    it('should return error if file too large', async () => {
      vi.mocked(auth as any).mockResolvedValue({ user: { role: 'super_user' }, expires: '' });
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });
      dbMock._setResolvedValue([{ id: 'm1', url: 'http://test.com/img.jpg', filename: 'img.jpg' }]);
      
      const archiverMock = (archiver as any)();
      archiverMock.pipe.mockImplementation((s: any) => {
        archiverMock.passthrough = s;
        // mock writing large chunk > 45MB
        setTimeout(() => s.write(Buffer.alloc(46 * 1024 * 1024)), 5);
      });

      const result = await runMediaBackupAndNotify();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toContain('too large');
    });
  });

  describe('runWeeklyMediaBackup', () => {
    it('should run cron media backup', async () => {
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });

      dbMock._setResolvedValue([{ id: 'm1', url: 'http://test.com/img.jpg', filename: '' }]);
      
      const archiverMock = (archiver as any)();
      archiverMock.pipe.mockImplementation((s: any) => {
        archiverMock.passthrough = s;
        setTimeout(() => s.write(Buffer.from('zip data')), 5);
      });

      // Also mock fetch error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await runWeeklyMediaBackup();
      expect(result.success).toBe(true);
      expect(sendTelegramDocument).toHaveBeenCalled();
    });

    it('should skip if telegram not configured', async () => {
      vi.mocked(getCachedOptions).mockResolvedValue({});
      const result = await runWeeklyMediaBackup();
      expect(result.success).toBe(false);
    });

    it('should fail if too large', async () => {
      vi.mocked(getCachedOptions).mockResolvedValue({
        telegram_bot_token: 'token',
        telegram_chat_id: 'chat',
      });
      dbMock._setResolvedValue([{ id: 'm1', url: 'http://test.com/img.jpg', filename: '' }]);
      const archiverMock = (archiver as any)();
      archiverMock.pipe.mockImplementation((s: any) => {
        archiverMock.passthrough = s;
        setTimeout(() => s.write(Buffer.alloc(46 * 1024 * 1024)), 5);
      });

      const result = await runWeeklyMediaBackup();
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).toContain('too large');
    });
  });
});
