import { ThemeOptionField } from "@/lib/themes";

export const options: ThemeOptionField[] = [
    {
        id: "theme_news_cta_text",
        label: "Header CTA Text",
        type: "text",
        description: "Label for the header button (e.g., 'Kirim Artikel').",
        group: "Identity",
        defaultValue: "Kirim Tulisan"
    },
    {
        id: "theme_news_cta_url",
        label: "Header CTA URL",
        type: "url",
        description: "Destination URL for the header button.",
        group: "Identity"
    },
    {
        id: "theme_news_header_height",
        label: "Header Height (Desktop)",
        type: "number",
        description: "Vertical padding for the header in pixels. Default is 16.",
        group: "Identity",
        defaultValue: "16"
    },
    {
        id: "theme_news_logo_height",
        label: "Logo Height",
        type: "number",
        description: "Height of the logo in pixels. Default is 40.",
        group: "Identity",
        defaultValue: "40"
    },
    {
        id: "theme_news_show_cta",
        label: "Show Header CTA",
        type: "select",
        description: "Toggle to show or hide the Call to Action button in the header.",
        options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" }
        ],
        group: "Identity",
        defaultValue: "yes"
    },
    {
        id: "theme_news_cta_color",
        label: "Header CTA Color",
        type: "color",
        description: "Background color for the Call to Action button. Default is #3A9D36.",
        group: "Colors",
        defaultValue: "#3A9D36"
    },
    {
        id: "theme_news_primary_color",
        label: "Primary Color",
        type: "color",
        description: "Main theme color (Header/Nav/Footer background). Default is #001A33.",
        group: "Colors",
        defaultValue: "#001A33"
    },
    {
        id: "theme_news_accent_color",
        label: "Accent Color",
        type: "color",
        description: "Primary accent color for highlights and buttons. Default is #B4F81B.",
        group: "Colors",
        defaultValue: "#B4F81B"
    },
    {
        id: "theme_news_hero_post",
        label: "Hero Featured Post",
        type: "post",
        description: "Main post displayed in the hero section.",
        group: "Homepage"
    },
    {
        id: "theme_news_featured_cat",
        label: "Featured Category (Auto-Scroll)",
        type: "category",
        description: "Category displayed in the auto-scrolling marquee section.",
        group: "Homepage"
    },
    {
        id: "theme_news_home_categories",
        label: "Category Grid",
        type: "category-multi",
        description: "Select categories to display in the middle grid section. Each category shows a featured post with a list.",
        group: "Homepage"
    },
    {
        id: "theme_news_video_cat",
        label: "Video Category",
        type: "category",
        description: "Category displayed in the video section at the bottom.",
        group: "Homepage"
    }
];

export const getDefault = (id: string) => options.find((o) => o.id === id)?.defaultValue || "";
