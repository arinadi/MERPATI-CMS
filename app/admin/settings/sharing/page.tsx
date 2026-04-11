import { getOption } from "@/lib/actions/options";
import SharingSettings from "@/components/admin/settings/sharing-settings";

export const metadata = {
    title: "Sharing Settings - MERPATI Admin",
};

export default async function SharingSettingsPage() {
    const sharingPlatforms = await getOption("sharing_platforms");

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Sharing</h1>
                <p className="text-muted-foreground">
                    Configure social media sharing options and traffic tracking.
                </p>
            </div>
            <SharingSettings
                initialPlatforms={sharingPlatforms || ""}
            />
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 text-sm">
                <h3 className="font-bold text-blue-500 mb-2 flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">i</span>
                    About Traffic Tracking (UTM)
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    MERPATI CMS automatically appends UTM parameters (<code>utm_source</code> and <code>utm_medium</code>) to every shared link. 
                    This allows you to track which social platforms are driving most traffic to your site in Google Analytics or other analytics tools.
                </p>
            </div>
        </div>
    );
}
