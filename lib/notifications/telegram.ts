import { getOptions } from "@/lib/actions/options";

/**
 * Send a message to a Telegram chat via Bot API.
 * This is designed to be non-blocking.
 */
export async function sendTelegramAlert(message: string): Promise<void> {
    try {
        const settings = await getOptions([
            "telegram_bot_token",
            "telegram_chat_id",
            "telegram_notify_post",
            "telegram_notify_user"
        ]);

        const token = settings.telegram_bot_token;
        const chatId = settings.telegram_chat_id;

        if (!token || !chatId) {
            return;
        }

        // We don't await the fetch if we want it to be truly non-blocking in a long-running process,
        // but in Next.js Server Actions, it's safer to use waitUntil (if on Vercel) or just await it 
        // if we want to ensure it's sent. The prompt suggests wrapping in waitUntil for Edge.
        // For now, we'll perform the fetch and log errors.

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        // fire and forget (mostly)
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
        }).catch(err => {
            console.error("Telegram notification failed:", err);
        });

    } catch (error) {
        console.error("Error in sendTelegramAlert:", error);
    }
}
