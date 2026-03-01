"use server";

import { db } from "@/db";
import { terms } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function saveTerm(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const id = formData.get("id") as string | null;
    const name = formData.get("name") as string;
    const slugInput = formData.get("slug") as string;
    const type = formData.get("type") as "category" | "tag";
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string;

    if (!name || !type) return { error: "Name and type are required" };

    let slug = slugInput;
    if (!slug) {
        slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    try {
        if (id) {
            await db.update(terms)
                .set({ name, slug, description, parentId: parentId || null })
                .where(eq(terms.id, id));
        } else {
            await db.insert(terms).values({
                name,
                slug,
                type,
                description,
                parentId: parentId || null,
            });
        }

        revalidatePath("/categories");
        revalidatePath("/tags");
        revalidatePath("/posts/new");

        return { success: true };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to save term" };
    }
}

export async function deleteTerm(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.delete(terms).where(eq(terms.id, id));

        revalidatePath("/categories");
        revalidatePath("/tags");
        revalidatePath("/posts/new");

        return { success: true };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to delete term" };
    }
}
