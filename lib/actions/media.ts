"use server";

import { db } from "@/db";
import { media, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { put, del } from "@vercel/blob";
import { auth } from "@/auth";

export async function uploadMedia(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const file = formData.get("file") as File;
    if (!file) {
        return { error: "No file provided" };
    }

    if (!file.type.startsWith("image/")) {
        return { error: "Only image files are allowed" };
    }

    // Optional Check: 5MB limit
    if (file.size > 5 * 1024 * 1024) {
        return { error: "File size exceeds 5MB limit" };
    }

    try {
        const { url } = await put(file.name, file, {
            access: "public",
        });

        const [newMedia] = await db
            .insert(media)
            .values({
                url,
                filename: file.name,
                mimeType: file.type,
                size: file.size,
                authorId: session.user.id,
            })
            .returning();

        return { media: newMedia };
    } catch (error) {
        console.error("Upload error:", error);
        return { error: "Failed to upload file to Blob store" };
    }
}

export async function getMedia(page = 1, limit = 50) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        const offset = (page - 1) * limit;
        const items = await db
            .select({
                id: media.id,
                url: media.url,
                filename: media.filename,
                mimeType: media.mimeType,
                size: media.size,
                altText: media.altText,
                createdAt: media.createdAt,
                author: {
                    name: users.name,
                },
            })
            .from(media)
            .leftJoin(users, eq(media.authorId, users.id))
            .orderBy(desc(media.createdAt))
            .limit(limit)
            .offset(offset);

        return { items };
    } catch (error) {
        console.error("Get media error:", error);
        return { error: "Failed to fetch media" };
    }
}

export async function updateMedia(id: string, altText: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        const [updated] = await db
            .update(media)
            .set({ altText })
            .where(eq(media.id, id))
            .returning();

        if (!updated) {
            return { error: "Media not found" };
        }

        return { media: updated };
    } catch (error) {
        console.error("Update media error:", error);
        return { error: "Failed to update media attributes" };
    }
}

export async function deleteMedia(id: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        const [item] = await db
            .select()
            .from(media)
            .where(eq(media.id, id))
            .limit(1);

        if (!item) {
            return { error: "Media not found" };
        }

        // Delete from Vercel Blob
        await del(item.url);

        // Delete from DB
        await db.delete(media).where(eq(media.id, id));

        return { success: true };
    } catch (error) {
        console.error("Delete media error:", error);
        return { error: "Failed to delete media" };
    }
}
