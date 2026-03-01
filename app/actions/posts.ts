"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq, inArray } from "drizzle-orm";

export async function saveQuickDraft(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title) return { error: "Judul harus diisi" };

    // Generate a simple slug
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + "-" + Date.now();

    await db.insert(posts).values({
        title,
        content,
        slug,
        authorId: session.user.id,
        type: "post",
        status: "draft",
    });

    revalidatePath("/dashboard");
    revalidatePath("/posts");

    return { success: true };
}

export async function deletePosts(ids: string[]) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await db.delete(posts).where(inArray(posts.id, ids));

    revalidatePath("/dashboard");
    revalidatePath("/posts");
    return { success: true };
}

export async function updatePostStatus(ids: string[], newStatus: "draft" | "published" | "archived") {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await db.update(posts)
        .set({ status: newStatus })
        .where(inArray(posts.id, ids));

    revalidatePath("/dashboard");
    revalidatePath("/posts");
    return { success: true };
}

export async function savePost(postId: string | null, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const slugInput = formData.get("slug") as string;
    const status = (formData.get("status") || "draft") as "draft" | "published" | "archived";
    const type = (formData.get("type") || "post") as "post" | "page";
    const coverImage = formData.get("coverImage") as string;
    const metaTitle = formData.get("metaTitle") as string;
    const metaDescription = formData.get("metaDescription") as string;

    if (!title) return { error: "Title is required" };

    let slug = slugInput;
    if (!slug) {
        slug = title.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") + "-" + Date.now();
    }

    const values = {
        title,
        content,
        excerpt,
        slug,
        status,
        type,
        coverImage: coverImage || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        authorId: session.user.id,
        updatedAt: new Date(),
        publishedAt: status === "published" ? new Date() : null, // Simplistic approach
    };

    try {
        let resultId = postId;
        if (postId) {
            // Update
            await db.update(posts).set(values).where(eq(posts.id, postId));
        } else {
            // Insert
            const [newPost] = await db.insert(posts).values(values).returning({ id: posts.id });
            resultId = newPost.id;
        }

        revalidatePath("/dashboard");
        revalidatePath("/posts");
        revalidatePath("/pages-manage");

        return { success: true, id: resultId };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to save post" };
    }
}
