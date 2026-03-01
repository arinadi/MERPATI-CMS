"use server";

import { db } from "@/db";
import { users, pendingInvitations } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function inviteUser(formData: FormData) {
    const session = await auth();
    // Only super_user can invite
    if (session?.user?.role !== "super_user") return { error: "Unauthorized" };

    const email = formData.get("email") as string;
    const role = formData.get("role") as "user" | "super_user";

    if (!email) return { error: "Email is required" };

    try {
        await db.insert(pendingInvitations).values({
            email: email.toLowerCase(),
            role,
        });

        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to invite user" };
    }
}

export async function revokeInvite(id: string) {
    const session = await auth();
    if (session?.user?.role !== "super_user") return { error: "Unauthorized" };

    try {
        await db.delete(pendingInvitations).where(eq(pendingInvitations.id, id));
        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to revoke invitation" };
    }
}

export async function updateUserStatus(id: string, active: boolean) {
    const session = await auth();
    if (session?.user?.role !== "super_user") return { error: "Unauthorized" };

    // Prevent self-deactivation
    if (session.user.id === id) return { error: "Cannot deactivate yourself" };

    try {
        await db.update(users).set({ active }).where(eq(users.id, id));
        revalidatePath("/users");
        return { success: true };
    } catch (err) {
        return { error: err instanceof Error ? err.message : "Failed to update user status" };
    }
}
