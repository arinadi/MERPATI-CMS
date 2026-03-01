import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditorClient from "../../editor-client";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const postData = await db.query.posts.findFirst({
        where: eq(posts.id, id)
    });

    if (!postData) {
        notFound();
    }

    return <EditorClient initialData={postData} />;
}
