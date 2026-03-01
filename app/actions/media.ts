"use server";

import { db } from "@/db";
import { media } from "@/db/schema";
import { auth } from "@/auth";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function uploadMedia(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const file = formData.get("file") as File;
    if (!file) return { error: "No file provided" };

    try {
        // Vercel Blob requires BLOB_READ_WRITE_TOKEN in .env
        // Skip upload if missing token, fall back to a mock for local dev without env
        let url = "";
        const size = file.size;

        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(file.name, file, { access: "public" });
            url = blob.url;
        } else {
            console.warn("BLOB_READ_WRITE_TOKEN is missing. Returning mock URL.");
            url = `https://mock-blob-url.com/${file.name}`;
        }

        const [newMedia] = await db.insert(media).values({
            filename: file.name,
            url,
            mimeType: file.type,
            size,
            uploadedBy: session.user.id,
        }).returning();

        revalidatePath("/media");
        return { success: true, media: newMedia };
    } catch (err: unknown) {
        console.error("Media upload error:", err);
        return { error: err instanceof Error ? err.message : "Failed to upload media" };
    }
}

export async function deleteMedia(id: string, url: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        if (process.env.BLOB_READ_WRITE_TOKEN && !url.includes("mock-blob-url")) {
            await del(url);
        }

        await db.delete(media).where(eq(media.id, id));

        revalidatePath("/media");
        return { success: true };
    } catch (err: unknown) {
        console.error("Media delete error:", err);
        return { error: err instanceof Error ? err.message : "Failed to delete media via Blob URL" };
    }
}
