# Reference: Telegram Bot API

## Overview
A simple HTTP API to send push notifications to a configured Telegram channel or chat.

## Constraints
* No SDK needed. Standard `fetch()` calls are preferred to keep dependencies low.
* Requires a Bot Token (from `@BotFather`) and a Chat ID.

## Send Message Endpoint
`POST https://api.telegram.org/bot<token>/sendMessage`

## Payload Structure
```json
{
  "chat_id": "123456789",
  "text": "Your message here",
  "parse_mode": "HTML" // or "MarkdownV2"
}
```

## Implementation Example
```typescript
export async function sendTelegramNotification(token: string, chatId: string, message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error("Telegram API Error:", await response.text());
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}
```

## Usage Note in Next.js
If triggering this within a Server Action on Vercel, use `waitUntil()` (if using Edge runtime) or simply execute it without `await`-ing if you don't want to block the user-facing response, though un-awaited promises in recent Next.js node runtimes can sometimes be terminated early. Next.js 15+ has specific guidelines for `after()` or `waitUntil()`.
