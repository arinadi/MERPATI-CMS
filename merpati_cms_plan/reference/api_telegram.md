# API Reference: Telegram Bot API (Notifications)

## Overview
- **Service**: Telegram Bot API — send messages to chats/groups
- **Base URL**: `https://api.telegram.org/bot<TOKEN>/`
- **Auth**: Bot token (obtained from @BotFather)
- **Usage**: Send-only notifications (no polling, no webhook)
- **Cost**: Free, unlimited

## Setup
1. Message `@BotFather` on Telegram → `/newbot` → get token
2. Create a group/channel → add the bot → get Chat ID
3. To find Chat ID: send a message in the group, then call `getUpdates`:
   ```
   GET https://api.telegram.org/bot<TOKEN>/getUpdates
   ```
   Look for `chat.id` in the response.

## Key Endpoint: sendMessage

```
POST https://api.telegram.org/bot<TOKEN>/sendMessage
Content-Type: application/json

{
  "chat_id": "-100xxxxxxxxxx",
  "text": "📝 *New Post Published*\n\n*Title:* My Article\n*Author:* John Doe\n*Link:* [Read →](https://example.com/my-article)",
  "parse_mode": "MarkdownV2",
  "disable_web_page_preview": false
}
```

### Parameters
| Param | Type | Required | Description |
|---|---|---|---|
| `chat_id` | string/int | ✅ | Target chat/group ID |
| `text` | string | ✅ | Message text (max 4096 chars) |
| `parse_mode` | string | — | `MarkdownV2`, `HTML`, or empty |
| `disable_web_page_preview` | boolean | — | If true, no link preview |

### Response
```json
{
  "ok": true,
  "result": {
    "message_id": 123,
    "from": { "id": 123, "is_bot": true, "first_name": "MERPATI" },
    "chat": { "id": -100123, "title": "MERPATI Notifications" },
    "text": "..."
  }
}
```

## Implementation (No Dependencies)
```typescript
// lib/telegram.ts
import { db } from '@/lib/db';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function getSetting(key: string): Promise<string | null> {
  const row = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return row[0]?.value ?? null;
}

export async function sendTelegramNotification(message: string): Promise<boolean> {
  const token = await getSetting('telegram_bot_token');
  const chatId = await getSetting('telegram_chat_id');

  if (!token || !chatId) return false;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
      }),
    });
    return res.ok;
  } catch {
    console.error('Telegram notification failed');
    return false;
  }
}
```

## MarkdownV2 Escaping
Characters that must be escaped with `\`: `_ * [ ] ( ) ~ > # + - = | { } . !`

## Rate Limits
| Limit | Value |
|---|---|
| Messages to same chat | 1/second |
| Messages to same group | 20/minute |
| Bulk messages | 30 messages/second overall |

## Error Codes
| Code | Description |
|---|---|
| 400 | Bad request (invalid chat_id, malformed markdown) |
| 401 | Unauthorized (invalid bot token) |
| 403 | Bot was blocked by user or not in group |
| 429 | Too many requests (rate limited) |

## Caveats
- **MarkdownV2 is strict** — must escape special chars or use HTML parse mode instead
- **Bot must be added to group** — won't send if bot isn't a member
- **Silent fail is fine** — notifications are best-effort, never block the main action
