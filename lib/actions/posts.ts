"use server";

import { db } from "@/db";
import { posts, users, postRelationships, termRelationships, terms } from "@/db/schema";
import { syncPostTerms } from "./terms";
import { eq, and, desc, count, ilike, ne } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import DOMPurify from "isomorphic-dompurify";

// ─── Schemas ────────────────────────────────────────────────────────────────

const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    type: z.enum(["post", "page"]).default("post"),
    featuredImage: z.string().optional(),
    relatedPostIds: z.array(z.string()).optional(),
});

// ─── Helpers ────────────────────────────────────────────────────────────────

function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
            "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
            "img", "figure", "figcaption", "hr", "table", "thead", "tbody",
            "tr", "th", "td", "div", "span",
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "src", "alt", "title", "width", "height",
            "class", "id",
        ],
    });
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 200);
}

function extractExcerpt(html: string, maxLength = 200): string {
    // Get the first <p>...</p> content, strip all tags
    const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!match) return "";
    const text = match[1].replace(/<[^>]*>/g, "").trim();
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getPosts(
    type: "post" | "page" = "post",
    page = 1,
    limit = 20
) {
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
        db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                status: posts.status,
                type: posts.type,
                authorId: posts.authorId,
                authorName: users.name,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.type, type))
            .orderBy(desc(posts.updatedAt))
            .limit(limit)
            .offset(offset),
        db
            .select({ count: count() })
            .from(posts)
            .where(eq(posts.type, type)),
    ]);

    return {
        items,
        total: total[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((total[0]?.count ?? 0) / limit),
    };
}

export async function getPostById(id: string) {
    try {
        const [post] = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                content: posts.content,
                excerpt: posts.excerpt,
                status: posts.status,
                type: posts.type,
                featuredImage: posts.featuredImage,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
                author: {
                    id: users.id,
                    name: users.name,
                },
            })
            .from(posts)
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.id, id));

        if (!post) {
            return { error: "Post not found." };
        }

        // Fetch related posts
        const related = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                type: posts.type,
            })
            .from(postRelationships)
            .innerJoin(posts, eq(postRelationships.relatedPostId, posts.id))
            .where(eq(postRelationships.postId, id));

        // Fetch terms (categories and tags) map
        const postTermsRaw = await db
            .select({
                id: terms.id,
                name: terms.name,
                slug: terms.slug,
                taxonomy: terms.taxonomy,
            })
            .from(termRelationships)
            .innerJoin(terms, eq(termRelationships.termId, terms.id))
            .where(eq(termRelationships.objectId, id));

        const categories = postTermsRaw.filter(t => t.taxonomy === "category");
        const tags = postTermsRaw.filter(t => t.taxonomy === "tag");

        return {
            post: {
                ...post,
                relatedPosts: related,
                categories,
                tags,
            }
        };
    } catch (error) {
        console.error("Error fetching post by ID:", error);
        return { error: "Failed to fetch post." };
    }
}

export async function getPostBySlug(slugString: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, slugString))
            .limit(1);

        if (!post) {
            return { error: "Post not found." };
        }

        const id = post.id;

        // Fetch related posts map
        const related = await db
            .select({
                id: posts.id,
                title: posts.title,
            })
            .from(postRelationships)
            .innerJoin(posts, eq(postRelationships.relatedPostId, posts.id))
            .where(eq(postRelationships.postId, id));

        // Fetch terms (categories and tags) map
        const postTermsRaw = await db
            .select({
                id: terms.id,
                name: terms.name,
                slug: terms.slug,
                taxonomy: terms.taxonomy,
            })
            .from(termRelationships)
            .innerJoin(terms, eq(termRelationships.termId, terms.id))
            .where(eq(termRelationships.objectId, id));

        const categories = postTermsRaw.filter(t => t.taxonomy === "category");
        const tags = postTermsRaw.filter(t => t.taxonomy === "tag");

        return {
            post: {
                ...post,
                relatedPosts: related,
                categories,
                tags,
            }
        };
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return { error: "Failed to fetch post." };
    }
}

export async function searchPublishedPosts(query: string, excludeId?: string) {
    const conditions = [
        eq(posts.status, "published"),
        eq(posts.type, "post"),
    ];

    if (excludeId) {
        conditions.push(ne(posts.id, excludeId));
    }

    if (query.trim()) {
        conditions.push(ilike(posts.title, `%${query}%`));
    }

    const results = await db
        .select({ id: posts.id, title: posts.title })
        .from(posts)
        .where(and(...conditions))
        .orderBy(desc(posts.updatedAt))
        .limit(10);

    return results;
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export async function createPost(data: {
    title: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    status?: "draft" | "published";
    type?: "post" | "page";
    featuredImage?: string | null;
    relatedPostIds?: string[];
    termIds?: string[];
}) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const slug = data.slug?.trim() || generateSlug(data.title);
    const sanitizedContent = data.content ? sanitizeHtml(data.content) : "";

    const parsed = postSchema.safeParse({
        ...data,
        slug,
        content: sanitizedContent,
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message ?? "Validation failed" };
    }

    // Check slug uniqueness
    const existingSlug = await db
        .select({ id: posts.id })
        .from(posts)
        .where(eq(posts.slug, slug));

    const finalSlug =
        existingSlug.length > 0 ? `${slug}-${Date.now()}` : slug;

    const [newPost] = await db
        .insert(posts)
        .values({
            title: parsed.data.title,
            slug: finalSlug,
            content: parsed.data.content,
            excerpt: parsed.data.excerpt || extractExcerpt(sanitizedContent) || null,
            status: parsed.data.status,
            type: parsed.data.type,
            authorId: session.user.id,
            featuredImage: parsed.data.featuredImage ?? null,
        })
        .returning({ id: posts.id });

    // Sync related posts
    if (data.relatedPostIds && data.relatedPostIds.length > 0 && newPost) {
        await db.insert(postRelationships).values(
            data.relatedPostIds.map((relatedId) => ({
                postId: newPost.id,
                relatedPostId: relatedId,
            }))
        );
    }

    // Sync terms
    if (data.termIds && newPost) {
        await syncPostTerms(newPost.id, data.termIds);
    }

    const basePath = parsed.data.type === "page" ? "/admin/pages" : "/admin/posts";
    revalidatePath(basePath);

    return { success: true, id: newPost?.id };
}

export async function updatePost(
    id: string,
    data: {
        title?: string;
        slug?: string;
        content?: string;
        excerpt?: string;
        status?: "draft" | "published";
        featuredImage?: string | null;
        relatedPostIds?: string[];
        termIds?: string[];
    }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    // Check post exists
    const [existing] = await db
        .select({ id: posts.id, type: posts.type })
        .from(posts)
        .where(eq(posts.id, id));

    if (!existing) {
        return { error: "Post not found" };
    }

    // Build update values using properly typed object
    const updateValues: Partial<typeof posts.$inferInsert> = {
        updatedAt: new Date(),
    };

    if (data.title !== undefined) updateValues.title = data.title;
    if (data.excerpt !== undefined) updateValues.excerpt = data.excerpt;
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.featuredImage !== undefined)
        updateValues.featuredImage = data.featuredImage;

    if (data.content !== undefined) {
        const sanitized = sanitizeHtml(data.content);
        updateValues.content = sanitized;
        // Auto-fill excerpt if empty
        if (!data.excerpt?.trim()) {
            updateValues.excerpt = extractExcerpt(sanitized) || null;
        }
    }

    if (data.slug !== undefined && data.slug.trim()) {
        // Check slug uniqueness (exclude self)
        const slugConflict = await db
            .select({ id: posts.id })
            .from(posts)
            .where(and(eq(posts.slug, data.slug), ne(posts.id, id)));

        if (slugConflict.length > 0) {
            return { error: "Slug is already in use" };
        }
        updateValues.slug = data.slug;
    }

    await db.update(posts).set(updateValues).where(eq(posts.id, id));

    // Sync related posts
    if (data.relatedPostIds) {
        await db
            .delete(postRelationships)
            .where(eq(postRelationships.postId, id));

        if (data.relatedPostIds.length > 0) {
            await db.insert(postRelationships).values(
                data.relatedPostIds.map((relatedId) => ({
                    postId: id,
                    relatedPostId: relatedId,
                }))
            );
        }
    }

    // Sync terms
    if (data.termIds) {
        await syncPostTerms(id, data.termIds);
    }

    const basePath = existing.type === "page" ? "/admin/pages" : "/admin/posts";
    revalidatePath(basePath);
    revalidatePath(`${basePath}/${id}`);

    return { success: true };
}

export async function deletePost(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    const [existing] = await db
        .select({ id: posts.id, type: posts.type })
        .from(posts)
        .where(eq(posts.id, id));

    if (!existing) {
        return { error: "Post not found" };
    }

    await db.delete(posts).where(eq(posts.id, id));

    const basePath = existing.type === "page" ? "/admin/pages" : "/admin/posts";
    revalidatePath(basePath);

    return { success: true };
}
