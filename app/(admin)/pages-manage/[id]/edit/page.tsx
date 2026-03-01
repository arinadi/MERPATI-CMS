import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditorClient from "../../../posts/editor-client";

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const postData = await db.query.posts.findFirst({
        where: and(eq(posts.id, id), eq(posts.type, "page"))
    });

    if (!postData) {
        notFound();
    }

    return <EditorClient initialData={postData} />;
}
