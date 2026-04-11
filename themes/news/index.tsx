import { ThemeExports, ThemeOptionField } from "@/lib/themes";
import ThemeLayout from "./components/layout";
import Archive from "./components/archive";
import SinglePost from "./components/single-post";
import SinglePage from "./components/single-page";
import NotFound from "./components/not-found";
import Home from "./components/home";
import "./theme.css";

const options: ThemeOptionField[] = [
    {
        id: "theme_news_cta_text",
        label: "Header CTA Text",
        type: "text",
        description: "Label for the header button (e.g., 'Kirim Artikel').",
        group: "Identity"
    },
    {
        id: "theme_news_cta_url",
        label: "Header CTA URL",
        type: "url",
        description: "Destination URL for the header button.",
        group: "Identity"
    },
    {
        id: "theme_news_primary_color",
        label: "Primary Color",
        type: "color",
        description: "Main theme color (Header/Nav/Footer background). Default is #001A33.",
        group: "Colors"
    },
    {
        id: "theme_news_accent_color",
        label: "Accent Color",
        type: "color",
        description: "Primary accent color for highlights and buttons. Default is #B4F81B.",
        group: "Colors"
    },
    {
        id: "theme_news_hero_post",
        label: "Hero Featured Post",
        type: "post",
        description: "Main post displayed in the hero section.",
        group: "Homepage"
    },
    {
        id: "theme_news_home_cat_1",
        label: "Featured Category 1",
        type: "text",
        description: "Slug of the first category displayed on the home page rows (e.g. 'esai').",
        group: "Homepage"
    },
    {
        id: "theme_news_home_cat_2",
        label: "Featured Category 2",
        type: "text",
        description: "Slug of the second category displayed on the home page rows (e.g. 'liputan').",
        group: "Homepage"
    },
    {
        id: "theme_news_home_cat_3",
        label: "Featured Category 3",
        type: "text",
        description: "Slug of the third category displayed on the home page rows.",
        group: "Homepage"
    },
    {
        id: "theme_news_home_cat_4",
        label: "Featured Category 4",
        type: "text",
        description: "Slug of the fourth category displayed on the home page rows.",
        group: "Homepage"
    },
    {
        id: "theme_news_home_video_cat",
        label: "Video Category Slug",
        type: "text",
        description: "Slug of the Video category for the bottom row.",
        group: "Homepage"
    }
];

export { ThemeLayout, Archive, SinglePost, SinglePage, NotFound, Home };

export const newsTheme: ThemeExports = {
    ThemeLayout,
    Archive,
    SinglePost,
    SinglePage,
    NotFound,
    Home,
    options
};
