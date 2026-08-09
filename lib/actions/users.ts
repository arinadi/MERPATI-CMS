"use server";

import { db } from "@/db";
import { users, invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkRole } from "@/lib/rbac";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";

const inviteSchema = z.object({
    email: z.email("Please enter a valid email address."),
});

export async function getUsers() {
    const allUsers = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
            status: users.status,
            image: users.image,
            createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(users.createdAt);

    return allUsers;
}

export async function updateProfile(data: { name: string }) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    if (!data.name?.trim()) return { error: "Name cannot be empty" };

    try {
        await db.update(users)
            .set({ name: data.name, updatedAt: new Date() })
            .where(eq(users.id, session.user.id));
        return { success: true };
    } catch {
        return { error: "Failed to update profile" };
    }
}

export async function updateUserRole(id: string, newRole: "user" | "super_user") {
    await checkRole(["super_user"]);
    try {
        await db.update(users)
            .set({ role: newRole, updatedAt: new Date() })
            .where(eq(users.id, id));
        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { error: "Failed to update role" };
    }
}

export async function updateUserStatus(id: string, newStatus: "active" | "suspended") {
    await checkRole(["super_user"]);
    try {
        await db.update(users)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(users.id, id));
        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { error: "Failed to update status" };
    }
}

export async function renameUser(id: string, newName: string) {
    await checkRole(["super_user"]);
    if (!newName?.trim()) return { error: "Name cannot be empty" };
    try {
        await db.update(users)
            .set({ name: newName, updatedAt: new Date() })
            .where(eq(users.id, id));
        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { error: "Failed to rename user" };
    }
}

export async function deleteUser(id: string) {
    await checkRole(["super_user"]);
    
    // Prevent self-deletion
    const session = await auth();
    if (session?.user?.id === id) {
        return { error: "You cannot delete your own account." };
    }

    try {
        await db.delete(users).where(eq(users.id, id));
        revalidatePath("/admin/users");
        return { success: true };
    } catch {
        return { error: "Failed to delete user" };
    }
}

export async function inviteUser(formData: FormData) {
    // Only super_user can invite
    await checkRole(["super_user"]);

    const email = formData.get("email") as string;

    // Validate
    const result = inviteSchema.safeParse({ email });
    if (!result.success) {
        return { error: result.error.issues[0]?.message ?? "Invalid email." };
    }

    // Check if user already exists
    const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));

    if (existingUser.length > 0) {
        return { error: "A user with this email already exists." };
    }

    // Check if invitation already exists
    const existingInvite = await db
        .select({ id: invitations.id })
        .from(invitations)
        .where(eq(invitations.email, email));

    if (existingInvite.length > 0) {
        return { error: "An invitation for this email already exists." };
    }

    // Create invitation
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(invitations).values({
        email,
        token,
        status: "pending",
        expiresAt,
    });

    // Trigger Telegram Alert for invitation
    const { getOption } = await import("@/lib/actions/options");
    const shouldNotify = await getOption("telegram_notify_user");

    if (shouldNotify === "true") {
        const { sendTelegramAlert } = await import("@/lib/notifications/telegram");
        sendTelegramAlert(`<b>New User Invited:</b> ${email}`);
    }

    revalidatePath("/admin/users");

    return { success: true, message: `Invitation sent to ${email}.` };
}
