import { activeTheme } from "@/lib/themes";
import { getOptions } from "@/lib/actions/options";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ThemeOptionsForm from "./theme-options-form";

export const dynamic = "force-dynamic";

export default async function ThemeOptionsPage() {
    const optionsSchema = activeTheme.options;

    if (!optionsSchema || optionsSchema.length === 0) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Theme Options</h2>
                </div>
                <div className="text-muted-foreground bg-muted/20 p-8 rounded-lg border-2 border-dashed text-center">
                    The currently active theme does not have any specific options.
                </div>
            </div>
        );
    }

    const optionKeys = optionsSchema.map(o => o.id);
    const currentValues = await getOptions(optionKeys);

    // Fetch posts if any field is of type "post"
    const hasPostField = optionsSchema.some(o => o.type === "post");
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
                schema={optionsSchema} 
                initialValues={currentValues} 
                availablePosts={availablePosts}
            />
        </div>
    );
}
