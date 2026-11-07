import { getOptions } from "@/lib/actions/options";
import PostDisplaySettings from "@/components/admin/settings/post-display-settings";
import { parsePostDisplay, POST_DISPLAY_KEYS, THEME_PART_SUPPORT, type ThemeName } from "@/lib/post-display";

export const metadata = {
    title: "Post Display Settings - MERPATI Admin",
};

export default async function PostDisplaySettingsPage() {
    const settings = await getOptions(POST_DISPLAY_KEYS);
    // ACTIVE_THEME is set at build time (lib/themes.ts). An unknown name is a configuration error, not a default.
    const themeName = process.env.ACTIVE_THEME || "default";
    if (!(themeName in THEME_PART_SUPPORT)) {
        throw new Error(`ACTIVE_THEME "${themeName}" has no Post Display support table in lib/post-display.ts`);
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Post Display</h1>
                <p className="text-muted-foreground">
                    Choose which parts of a public post are shown on the site.
                </p>
            </div>
            <PostDisplaySettings values={parsePostDisplay(settings)} theme={themeName as ThemeName} />
        </div>
    );
}
