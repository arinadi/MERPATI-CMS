import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendTelegramAlert, sendTelegramDocument } from '@/lib/notifications/telegram';
import { getOptions } from '@/lib/actions/options';

vi.mock('@/lib/actions/options', () => ({
  getOptions: vi.fn(),
}));

describe('Telegram Notifications', () => {
  const mockToken = 'bot-token';
  const mockChatId = 'chat-123';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
  });

  describe('sendTelegramAlert', () => {
    it('should not send if token or chatId missing', async () => {
      vi.mocked(getOptions).mockResolvedValueOnce({});
      await sendTelegramAlert('test');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should send POST request to Telegram API', async () => {
      vi.mocked(getOptions).mockResolvedValueOnce({
        telegram_bot_token: mockToken,
        telegram_chat_id: mockChatId,
      });

      await sendTelegramAlert('Hello');

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.telegram.org/bot${mockToken}/sendMessage`,
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Hello'),
        })
      );
    });
  });

  describe('sendTelegramDocument', () => {
    it('should send file via FormData', async () => {
      vi.mocked(getOptions).mockResolvedValueOnce({
        telegram_bot_token: mockToken,
        telegram_chat_id: mockChatId,
      });

      const buffer = Buffer.from('test content');
      await sendTelegramDocument(buffer, 'test.txt', 'Backup file');

      expect(global.fetch).toHaveBeenCalledWith(
        `https://api.telegram.org/bot${mockToken}/sendDocument`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });
  });
});
