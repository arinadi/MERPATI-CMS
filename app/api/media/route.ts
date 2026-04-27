import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";
import { put } from "@vercel/blob";
import { getAuthorizedUser } from "@/lib/api-auth";

export async function POST(req: Request) {
    try {
        const user = await getAuthorizedUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        // Limit: 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
        }

        // Upload to Vercel Blob
        const { url } = await put(file.name, file, {
            access: "public",
            addRandomSuffix: true,
        });

        // Save to DB
        const [newMedia] = await db
            .insert(media)
            .values({
                url,
                filename: file.name,
                mimeType: file.type,
                size: file.size,
                authorId: user.id,
            })
            .returning();

        return NextResponse.json({ 
            success: true, 
            media: {
                id: newMedia.id,
                url: newMedia.url,
                filename: newMedia.filename
            } 
        });

    } catch (error) {
        console.error("API Media Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
