import { getOptions } from "@/lib/actions/options";
import TrackingSettings from "@/components/admin/settings/tracking-settings";

export const metadata = {
    title: "Tracking Settings - MERPATI Admin",
};

export default async function TrackingSettingsPage() {
    const settings = await getOptions([
        "gtm_id",
        "ga_id",
        "cf_analytics_token",
    ]);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
                <p className="text-muted-foreground">
                    Configure third-party analytics and tracking services.
                </p>
            </div>
            <TrackingSettings
                gtmId={settings.gtm_id || ""}
                gaId={settings.ga_id || ""}
                cfAnalyticsToken={settings.cf_analytics_token || ""}
            />
        </div>
    );
}
