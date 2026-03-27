import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOptions } from "@/lib/actions/options";
import GeneralSettings from "@/components/admin/settings/general-settings";
import ContactSettings from "@/components/admin/settings/contact-settings";
import NotificationSettings from "@/components/admin/settings/notification-settings";
import TrackingSettings from "@/components/admin/settings/tracking-settings";

export const metadata = {
    title: "Settings - MERPATI Admin",
};

export default async function SettingsPage() {
    const settings = await getOptions([
        "site_title",
        "site_tagline",
        "site_url",
        "site_logo",
        "favicon",
        "site_contacts",
        "telegram_chat_id",
        "telegram_notify_post",
        "telegram_notify_user",
        "gtm_id",
        "cf_analytics_token",
        "posts_per_page"
    ]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your site&apos;s global configuration and notifications.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 md:w-auto">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <GeneralSettings
                        siteTitle={settings.site_title || ""}
                        siteTagline={settings.site_tagline || ""}
                        siteUrl={settings.site_url || ""}
                        siteLogo={settings.site_logo || ""}
                        favicon={settings.favicon || ""}
                        postsPerPage={settings.posts_per_page || "12"}
                    />
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                    <ContactSettings
                        initialContacts={settings.site_contacts || "[]"}
                    />
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <NotificationSettings
                        botToken={settings.telegram_bot_token || ""}
                        chatId={settings.telegram_chat_id || ""}
                        notifyPost={settings.telegram_notify_post === "true"}
                        notifyUser={settings.telegram_notify_user === "true"}
                    />
                </TabsContent>

                <TabsContent value="tracking" className="space-y-4">
                    <TrackingSettings
                        gtmId={settings.gtm_id || ""}
                        cfAnalyticsToken={settings.cf_analytics_token || ""}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
