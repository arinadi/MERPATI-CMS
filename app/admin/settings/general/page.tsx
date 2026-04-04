import { getOptions } from "@/lib/actions/options";
import GeneralSettings from "@/components/admin/settings/general-settings";

export const metadata = {
    title: "General Settings - MERPATI Admin",
};

export default async function GeneralSettingsPage() {
    const settings = await getOptions([
        "site_title",
        "site_tagline",
        "site_url",
        "site_logo",
        "favicon",
        "posts_per_page",
    ]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">General</h1>
                <p className="text-muted-foreground">
                    Manage your site&apos;s basic information and configuration.
                </p>
            </div>
            <GeneralSettings
                siteTitle={settings.site_title || ""}
                siteTagline={settings.site_tagline || ""}
                siteUrl={settings.site_url || ""}
                siteLogo={settings.site_logo || ""}
                favicon={settings.favicon || ""}
                postsPerPage={settings.posts_per_page || "12"}
            />
        </div>
    );
}
