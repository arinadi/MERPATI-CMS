import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts, postRelationships, users } from "@/db/schema";
import { getAuthorizedUser } from "@/lib/api-auth";
import { syncPostTerms } from "@/lib/actions/terms";
import { revalidatePath } from "next/cache";
import { eq, and, desc, count, ilike } from "drizzle-orm";
import sanitize from "sanitize-html";

// Optimize runtime for cold starts (Node.js is default, using basic imports)
export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 200);
}

/**
 * GET /api/posts - List posts
 */
export async function GET(req: Request) {
    try {
        const user = await getAuthorizedUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const type = (searchParams.get("type") as "post" | "page") || "post";
        
        const offset = (page - 1) * limit;
        const conditions = [eq(posts.type, type)];
        
        if (search.trim()) {
            conditions.push(ilike(posts.title, `%${search.trim()}%`));
        }

        const [items, total] = await Promise.all([
            db
                .select({
                    id: posts.id,
                    title: posts.title,
                    slug: posts.slug,
                    status: posts.status,
                    createdAt: posts.createdAt,
                    author: { name: users.name }
                })
                .from(posts)
                .leftJoin(users, eq(posts.authorId, users.id))
                .where(and(...conditions))
                .orderBy(desc(posts.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ count: count() }).from(posts).where(and(...conditions))
        ]);

        return NextResponse.json({
            items,
            total: total[0]?.count ?? 0,
            page,
            totalPages: Math.ceil((total[0]?.count ?? 0) / limit)
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * POST /api/posts - Create post
 */
export async function POST(req: Request) {
    try {
        const user = await getAuthorizedUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await req.json();
        if (!data.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

        const slug = data.slug?.trim() || generateSlug(data.title);
        const [newPost] = await db
            .insert(posts)
            .values({
                title: data.title,
                slug: slug,
                content: data.content ? sanitize(data.content) : "",
                excerpt: data.excerpt || null,
                status: data.status || "draft",
                type: data.type || "post",
                authorId: user.id,
                featuredImage: data.featuredImage ?? null,
            })
            .returning();

        if (data.termIds) await syncPostTerms(newPost.id, data.termIds);

        revalidatePath("/");
        return NextResponse.json({ success: true, post: newPost });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
