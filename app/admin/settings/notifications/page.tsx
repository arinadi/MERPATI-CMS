import { getOptions } from "@/lib/actions/options";
import NotificationSettings from "@/components/admin/settings/notification-settings";

export const metadata = {
    title: "Notification Settings - MERPATI Admin",
};

export default async function NotificationSettingsPage() {
    const settings = await getOptions([
        "telegram_bot_token",
        "telegram_chat_id",
        "telegram_notify_post",
        "telegram_notify_user",
    ]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground">
                    Configure Telegram notifications for your site.
                </p>
            </div>
            <NotificationSettings
                botToken={settings.telegram_bot_token || ""}
                chatId={settings.telegram_chat_id || ""}
                notifyPost={settings.telegram_notify_post === "true"}
                notifyUser={settings.telegram_notify_user === "true"}
            />
        </div>
    );
}
