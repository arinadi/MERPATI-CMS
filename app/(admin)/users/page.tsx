import { db } from "@/db";
import { users, pendingInvitations } from "@/db/schema";
import { desc } from "drizzle-orm";
import UsersClient from "./users-client";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const session = await auth();

    const allUsers = await db.query.users.findMany({
        orderBy: [desc(users.emailVerified)]
    });

    const allInvites = await db.query.pendingInvitations.findMany({
        orderBy: [desc(pendingInvitations.invitedAt)]
    });

    const mappedUsers = allUsers.map(u => ({ ...u, email: u.email || "" }));
    const mappedInvites = allInvites.map(i => ({ ...i, createdAt: i.invitedAt }));

    return (
        <UsersClient
            initialUsers={mappedUsers}
            initialInvites={mappedInvites}
            currentUserRole={session?.user?.role}
        />
    );
}
