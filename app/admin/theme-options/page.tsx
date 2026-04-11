import { activeTheme, ThemeOptionField } from "@/lib/themes";
import { getOptions } from "@/lib/actions/options";
import { db } from "@/db";
import { posts, terms } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import ThemeOptionsForm from "./theme-options-form";

export const dynamic = "force-dynamic";

const GLOBAL_OPTIONS: ThemeOptionField[] = [
    {
        id: "site_title",
        label: "Site Title",
        type: "text",
        group: "Identity",
        description: "The name of your website."
    },
    {
        id: "site_tagline",
        label: "Site Tagline",
        type: "text",
        group: "Identity",
        description: "A short catchphrase or description."
    },
    {
        id: "site_logo",
        label: "Site Logo",
        type: "image",
        group: "Identity",
    },
    {
        id: "favicon",
        label: "Favicon",
        type: "image",
        group: "Identity",
    },
    {
        id: "site_url",
        label: "Site URL",
        type: "url",
        group: "General",
        description: "The full URL of your website."
    },
    {
        id: "posts_per_page",
        label: "Posts Per Page",
        type: "number",
        group: "General",
        description: "Number of articles shown per page in archives."
    },
    {
        id: "site_contacts",
        label: "Contact & Social Links",
        type: "contacts",
        group: "Social Media",
        description: "Manage your links with icons and reordering."
    },
    {
        id: "sharing_platforms",
        label: "Sharing Platforms",
        type: "checkbox-group",
        group: "Sharing",
        description: "Choose which platforms will be shown in the sharing menu.",
        options: [
            { label: "WhatsApp", value: "whatsapp" },
            { label: "Facebook", value: "facebook" },
            { label: "X (Twitter)", value: "twitter" },
            { label: "Telegram", value: "telegram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Reddit", value: "reddit" },
            { label: "Pinterest", value: "pinterest" },
            { label: "Threads", value: "threads" },
        ]
    }
];

export default async function ThemeOptionsPage() {
    const themeSchema = activeTheme.options || [];
    
    // Merge global options with theme-specific ones
    const themeIds = new Set(themeSchema.map(o => o.id));
    const mergedSchema = [...GLOBAL_OPTIONS.filter(o => !themeIds.has(o.id)), ...themeSchema];

    const optionKeys = mergedSchema.map(o => o.id);
    const currentValues = await getOptions(optionKeys);

    // Fetch posts if any field is of type "post"
    const hasPostField = mergedSchema.some(o => o.type === "post");
    let availablePosts: { id: string; title: string }[] = [];
    if (hasPostField) {
        availablePosts = await db
            .select({ id: posts.id, title: posts.title })
            .from(posts)
            .where(eq(posts.type, "post"))
            .orderBy(desc(posts.createdAt));
    }

    // Fetch categories if any field is of type "category" or "category-multi"
    const hasCategoryField = mergedSchema.some(o => o.type === "category" || o.type === "category-multi");
    let availableCategories: { id: string; name: string; slug: string }[] = [];
    if (hasCategoryField) {
        availableCategories = await db
            .select({ id: terms.id, name: terms.name, slug: terms.slug })
            .from(terms)
            .where(and(eq(terms.taxonomy, "category")))
            .orderBy(terms.name);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Theme Options</h2>
            </div>
            
            <ThemeOptionsForm 
                schema={mergedSchema} 
                initialValues={currentValues} 
                availablePosts={availablePosts}
                availableCategories={availableCategories}
            />
        </div>
    );
}
