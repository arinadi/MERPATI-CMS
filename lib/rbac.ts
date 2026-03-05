import { auth } from "@/auth";

export type UserRole = "super_user" | "user";

/**
 * Check if the current session user has one of the allowed roles.
 * Returns the session if authorized, throws if not.
 */
export async function checkRole(allowedRoles: UserRole[]) {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Unauthorized: Not authenticated.");
    }

    if (!allowedRoles.includes(session.user.role as UserRole)) {
        throw new Error("Forbidden: Insufficient permissions.");
    }

    return session;
}

/**
 * Check if a role value is the super_user role.
 */
export function isSuperUser(role?: string | null): boolean {
    return role === "super_user";
}
