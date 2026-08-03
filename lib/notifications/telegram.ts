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

/**
 * Send a document (file) to a Telegram chat via Bot API.
 */
export async function sendTelegramDocument(file: Buffer | Uint8Array, filename: string, caption?: string): Promise<void> {
    try {
        const settings = await getOptions([
            "telegram_bot_token",
            "telegram_chat_id"
        ]);

        const token = settings.telegram_bot_token;
        const chatId = settings.telegram_chat_id;

        if (!token || !chatId) {
            console.error("Telegram token or chat ID not set for backup");
            return;
        }

        const url = `https://api.telegram.org/bot${token}/sendDocument`;

        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("caption", caption || "");
        
        // Convert Buffer to Uint8Array for better compatibility with Blob in some environments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const blob = new Blob([file as any], { type: "application/octet-stream" });
        formData.append("document", blob, filename);

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to send Telegram document:", errorData);
        }

    } catch (error) {
        console.error("Error in sendTelegramDocument:", error);
    }
}
