import { activeTheme, ThemeOptionField } from "@/lib/themes";
import { getOptions } from "@/lib/actions/options";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
        type: "text",
        group: "Sharing",
        description: "Comma-separated list (e.g., facebook, twitter, whatsapp)."
    }
];

export default async function ThemeOptionsPage() {
    const themeSchema = activeTheme.options || [];
    
    // Merge global options with theme-specific ones
    // We filter out global options if the theme already defines them with the same ID
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

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Theme Options</h2>
            </div>
            
            <ThemeOptionsForm 
                schema={mergedSchema} 
                initialValues={currentValues} 
                availablePosts={availablePosts}
            />
        </div>
    );
}
