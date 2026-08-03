"use server";

import { db } from "@/db";
import { terms, termRelationships } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { z } from "zod";
import { checkRole } from "@/lib/rbac";

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100);
}

// ─── Schemas ────────────────────────────────────────────────────────────────

const termSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    slug: z.string().max(100).optional(),
    taxonomy: z.enum(["category", "tag"]),
    parentId: z.string().optional().nullable(),
    description: z.string().max(500).optional().nullable(),
});

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getTerms(taxonomy: "category" | "tag") {
    try {
        const result = await db
            .select()
            .from(terms)
            .where(eq(terms.taxonomy, taxonomy))
            .orderBy(asc(terms.name));
        return { terms: result };
    } catch (error) {
        console.error(`Failed to get ${taxonomy}s:`, error);
        return { error: `Failed to fetch ${taxonomy}s.` };
    }
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export async function createTerm(data: z.infer<typeof termSchema>) {
    try {
        await checkRole(["super_user", "user"]);
        const parsed = termSchema.safeParse(data);
        if (!parsed.success) {
            return { error: "Invalid data provided." };
        }

        const { name, slug, taxonomy, parentId, description } = parsed.data;
        const finalSlug = slug ? slug.trim() : generateSlug(name);

        // Check if slug exists
        const existing = await db
            .select({ id: terms.id })
            .from(terms)
            .where(eq(terms.slug, finalSlug));

        if (existing.length > 0) {
            return { error: "Slug already exists. Please choose a different one." };
        }

        const [newTerm] = await db
            .insert(terms)
            .values({
                name,
                slug: finalSlug,
                taxonomy,
                parentId: parentId || null,
                description: description || null,
            })
            .returning();

        return { term: newTerm };
    } catch (error) {
        console.error("Failed to create term:", error);
        return { error: (error as Error).message || "Failed to create term." };
    }
}

export async function updateTerm(id: string, data: Partial<z.infer<typeof termSchema>>) {
    try {
        await checkRole(["super_user", "user"]);
        const updateValues: Partial<typeof terms.$inferInsert> = {};

        if (data.name !== undefined) updateValues.name = data.name;
        if (data.slug !== undefined && data.slug.trim()) updateValues.slug = data.slug.trim();
        if (data.parentId !== undefined) updateValues.parentId = data.parentId || null;
        if (data.description !== undefined) updateValues.description = data.description || null;

        // Verify slug uniqueness if changing
        if (updateValues.slug) {
            const existing = await db
                .select({ id: terms.id })
                .from(terms)
                .where(and(eq(terms.slug, updateValues.slug)));

            if (existing.length > 0 && existing[0].id !== id) {
                return { error: "Slug already exists. Please choose a different one." };
            }
        }

        const [updatedTerm] = await db
            .update(terms)
            .set(updateValues)
            .where(eq(terms.id, id))
            .returning();

        return { term: updatedTerm };
    } catch (error) {
        console.error("Failed to update term:", error);
        return { error: (error as Error).message || "Failed to update term." };
    }
}

export async function deleteTerm(id: string) {
    try {
        await checkRole(["super_user", "user"]);
        await db.delete(terms).where(eq(terms.id, id));
        return { success: true };
    } catch (error) {
        console.error("Failed to delete term:", error);
        return { error: (error as Error).message || "Failed to delete term." };
    }
}

// ─── Term Relationships ──────────────────────────────────────────────────────

export async function syncPostTerms(postId: string, termIds: string[]) {
    try {
        await checkRole(["super_user", "user"]);
        // Delete all existing relationships for this post
        await db.delete(termRelationships).where(eq(termRelationships.objectId, postId));

        // Insert new relationships
        if (termIds.length > 0) {
            const newRelations = termIds.map(termId => ({
                objectId: postId,
                termId,
            }));
            await db.insert(termRelationships).values(newRelations);
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to sync post terms:", error);
        return { error: (error as Error).message || "Failed to map terms to post." };
    }
}
