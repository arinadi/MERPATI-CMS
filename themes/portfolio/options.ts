import { ThemeOptionField } from "@/lib/themes";

export const options: ThemeOptionField[] = [
    {
        id: "theme_portfolio_jumbo_text_1",
        label: "Jumbo Text 1",
        type: "text",
        description: "The primary large text on the homepage hero section.",
        defaultValue: "Atomic Ideas,"
    },
    {
        id: "theme_portfolio_jumbo_text_2",
        label: "Jumbo Text 2",
        type: "text",
        description: "The secondary large text on the homepage hero section.",
        defaultValue: "Scalable Products."
    },
    {
        id: "theme_portfolio_small_text",
        label: "Small Text",
        type: "text",
        description: "A small descriptive text below the jumbo blocks.",
        defaultValue: "Menjembatani pemikiran fundamental (Atomic) dengan eksekusi rekayasa yang terukur (Scalable). Berfokus pada arsitektur sistem, pengalaman pengembang, dan antarmuka industrial."
    },
    {
        id: "theme_portfolio_post_1",
        label: "Featured Post 1",
        type: "post",
        description: "Select the first post to feature prominently.",
    },
    {
        id: "theme_portfolio_post_1_icon",
        label: "Post 1 Icon",
        type: "select",
        options: [
            { label: "CPU", value: "cpu" },
            { label: "Terminal", value: "terminal" },
            { label: "Radio", value: "radio" },
            { label: "Network", value: "network" },
            { label: "Database", value: "database" }
        ],
        defaultValue: "cpu"
    },
    {
        id: "theme_portfolio_post_1_status",
        label: "Post 1 Status",
        type: "select",
        options: [
            { label: "Live", value: "live" },
            { label: "In Development", value: "in-development" },
            { label: "Archived", value: "archived" }
        ],
        defaultValue: "live"
    },
    {
        id: "theme_portfolio_post_2",
        label: "Featured Post 2",
        type: "post",
        description: "Select the second post to feature.",
    },
    {
        id: "theme_portfolio_post_2_icon",
        label: "Post 2 Icon",
        type: "select",
        options: [
            { label: "CPU", value: "cpu" },
            { label: "Terminal", value: "terminal" },
            { label: "Radio", value: "radio" },
            { label: "Network", value: "network" },
            { label: "Database", value: "database" }
        ],
        defaultValue: "terminal"
    },
    {
        id: "theme_portfolio_post_2_status",
        label: "Post 2 Status",
        type: "select",
        options: [
            { label: "Live", value: "live" },
            { label: "In Development", value: "in-development" },
            { label: "Archived", value: "archived" }
        ],
        defaultValue: "in-development"
    },
    {
        id: "theme_portfolio_post_3",
        label: "Featured Post 3",
        type: "post",
        description: "Select the third post to feature.",
    },
    {
        id: "theme_portfolio_post_3_icon",
        label: "Post 3 Icon",
        type: "select",
        options: [
            { label: "CPU", value: "cpu" },
            { label: "Terminal", value: "terminal" },
            { label: "Radio", value: "radio" },
            { label: "Network", value: "network" },
            { label: "Database", value: "database" }
        ],
        defaultValue: "radio"
    },
    {
        id: "theme_portfolio_post_3_status",
        label: "Post 3 Status",
        type: "select",
        options: [
            { label: "Live", value: "live" },
            { label: "In Development", value: "in-development" },
            { label: "Archived", value: "archived" }
        ],
        defaultValue: "live"
    },
    {
        id: "theme_portfolio_cta_url",
        label: "CTA URL",
        type: "url",
        description: "URL for the bottom 'More' button.",
        defaultValue: "/archive"
    }
];

export const getDefault = (id: string) => options.find((o) => o.id === id)?.defaultValue || "";
