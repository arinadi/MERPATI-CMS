// Parts of a public post that an admin can switch off in Settings > Post Display.
export const POST_DISPLAY_PARTS = ["credits", "writer", "date_reading", "share", "terms"] as const;
export type PostDisplayPart = (typeof POST_DISPLAY_PARTS)[number];
export type PostDisplaySettings = Record<PostDisplayPart, boolean>;

export type ThemeName = "default" | "news" | "portfolio";

// What each theme renders for each switch, checked against the single-post components.
// "partial": the switch covers more than the theme renders, e.g. default shows the date but no reading time.
export const THEME_PART_SUPPORT: Record<ThemeName, Record<PostDisplayPart, "full" | "partial">> = {
    default: { credits: "full", writer: "full", date_reading: "partial", share: "full", terms: "full" },
    news: { credits: "full", writer: "full", date_reading: "full", share: "full", terms: "partial" },
    portfolio: { credits: "full", writer: "full", date_reading: "full", share: "full", terms: "full" },
};

export function postDisplayKey(part: PostDisplayPart): string {
    return `post_display_${part}`;
}

export const POST_DISPLAY_KEYS = POST_DISPLAY_PARTS.map(postDisplayKey);

// Only the exact value "false" hides a part. A missing key means the part is shown, so a new install
// and a part added later both start with everything visible.
export function parsePostDisplay(values: Record<string, string | undefined>): PostDisplaySettings {
    return Object.fromEntries(
        POST_DISPLAY_PARTS.map((part) => [part, values[postDisplayKey(part)] !== "false"])
    ) as PostDisplaySettings;
}
