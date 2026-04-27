import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postRelationships } from "@/db/schema";
import { getAuthorizedUser } from "@/lib/api-auth";
import { syncPostTerms } from "@/lib/actions/terms";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import sanitize from "sanitize-html";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 200);
}

function extractExcerpt(html: string, maxLength = 200): string {
    const text = html.replace(/<[^>]*>/g, "").trim();
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export async function POST(req: Request) {
    try {
        const user = await getAuthorizedUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        if (!data.title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        const slug = data.slug?.trim() || generateSlug(data.title);
        const sanitizedContent = data.content ? sanitize(data.content, {
            allowedTags: sanitize.defaults.allowedTags.concat(['img', 'h1', 'h2', 'video', 'iframe']),
            allowedAttributes: {
                ...sanitize.defaults.allowedAttributes,
                '*': ['class', 'id', 'style'],
                'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
                'video': ['src', 'controls', 'width', 'height', 'poster'],
            }
        }) : "";

        // Check slug uniqueness
        const existingSlug = await db
            .select({ id: posts.id })
            .from(posts)
            .where(eq(posts.slug, slug))
            .limit(1);

        const finalSlug = existingSlug.length > 0 ? `${slug}-${Date.now()}` : slug;

        const [newPost] = await db
            .insert(posts)
            .values({
                title: data.title,
                slug: finalSlug,
                content: sanitizedContent,
                excerpt: data.excerpt || extractExcerpt(sanitizedContent) || null,
                status: data.status || "draft",
                type: data.type || "post",
                authorId: user.id,
                featuredImage: data.featuredImage ?? null,
            })
            .returning();

        // Sync related posts
        if (data.relatedPostIds && Array.isArray(data.relatedPostIds)) {
            await db.insert(postRelationships).values(
                data.relatedPostIds.map((relatedId: string) => ({
                    postId: newPost.id,
                    relatedPostId: relatedId,
                }))
            );
        }

        // Sync terms (Categories/Tags)
        if (data.termIds && Array.isArray(data.termIds)) {
            await syncPostTerms(newPost.id, data.termIds);
        }

        revalidatePath("/");
        revalidatePath("/admin/posts");

        return NextResponse.json({ 
            success: true, 
            post: {
                id: newPost.id,
                slug: newPost.slug,
                url: `/${newPost.slug}`
            } 
        });

    } catch (error) {
        console.error("API Create Post error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
