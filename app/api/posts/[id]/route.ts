import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { getAuthorizedUser } from "@/lib/api-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts/[id] - Get single post
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthorizedUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

        if (!post) return NextResponse.json({ error: "Not Found" }, { status: 404 });

        return NextResponse.json({ post });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * PATCH /api/posts/[id] - Update post
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthorizedUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const data = await req.json();

        const [updated] = await db
            .update(posts)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, id))
            .returning();

        revalidatePath("/");
        return NextResponse.json({ success: true, post: updated });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * DELETE /api/posts/[id] - Delete post
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getAuthorizedUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await db.delete(posts).where(eq(posts.id, id));

        revalidatePath("/");
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
