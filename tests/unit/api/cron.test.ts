import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as backupGET } from '@/app/api/cron/backup/route';
import { GET as mediaBackupGET } from '@/app/api/cron/media-backup/route';
import { runCronBackup, runWeeklyMediaBackup } from '@/lib/actions/backup';
import { NextRequest } from 'next/server';

vi.mock('@/lib/actions/backup', () => ({
  runCronBackup: vi.fn(),
  runWeeklyMediaBackup: vi.fn(),
}));

describe('Cron API Routes', () => {
  const CRON_SECRET = 'test-secret';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('CRON_SECRET', CRON_SECRET);
    vi.stubEnv('NODE_ENV', 'production');
  });

  describe('GET /api/cron/backup', () => {
    it('should return 401 if unauthorized in production', async () => {
      const req = new NextRequest('http://l/api/cron/backup', {
        headers: { authorization: 'Bearer wrong' },
      });
      const res = await backupGET(req);
      expect(res.status).toBe(401);
    });

    it('should allow request with correct CRON_SECRET', async () => {
      vi.mocked(runCronBackup).mockResolvedValueOnce({ success: true, message: 'Done' });
      const req = new NextRequest('http://l/api/cron/backup', {
        headers: { authorization: `Bearer ${CRON_SECRET}` },
      });
      const res: any = await backupGET(req);
      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
    });

    it('should allow request with x-vercel-cron header', async () => {
      vi.mocked(runCronBackup).mockResolvedValueOnce({ success: true, message: 'Done' });
      const req = new NextRequest('http://l/api/cron/backup', {
        headers: { 'x-vercel-cron': '1' },
      });
      const res: any = await backupGET(req);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/cron/media-backup', () => {
    it('should run weekly media backup when authorized', async () => {
      vi.mocked(runWeeklyMediaBackup).mockResolvedValueOnce({ success: true, message: 'Done' });
      const req = new NextRequest('http://l/api/cron/media-backup', {
        headers: { authorization: `Bearer ${CRON_SECRET}` },
      });
      const res: any = await mediaBackupGET(req);
      expect(res.status).toBe(200);
      expect(runWeeklyMediaBackup).toHaveBeenCalled();
    });

    it('should return 500 if backup fails', async () => {
      vi.mocked(runWeeklyMediaBackup).mockResolvedValueOnce({ success: false, error: 'Storage full' });
      const req = new NextRequest('http://l/api/cron/media-backup', {
        headers: { authorization: `Bearer ${CRON_SECRET}` },
      });
      const res: any = await mediaBackupGET(req);
      expect(res.status).toBe(500);
      expect(res.data.error).toBe('Storage full');
    });
  });
});
