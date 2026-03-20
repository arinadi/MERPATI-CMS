"use server";

import { db } from "@/db";
import { users, invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { checkRole } from "@/lib/rbac";
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
            image: users.image,
            createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(users.createdAt);

    return allUsers;
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
