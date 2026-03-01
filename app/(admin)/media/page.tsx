import { db } from "@/db";
import { media } from "@/db/schema";
import { desc } from "drizzle-orm";
import MediaClient from "./media-client";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
    const allMedia = await db.query.media.findMany({
        orderBy: [desc(media.createdAt)],
        with: {
            author: true,
        }
    });

    const formattedMedia = allMedia.map(m => ({
        id: m.id,
        filename: m.filename,
        url: m.url,
        mimeType: m.mimeType,
        size: m.size,
        createdAt: m.createdAt,
        authorName: m.author?.name || "Unknown",
    }));

    return <MediaClient initialMedia={formattedMedia} />;
}
