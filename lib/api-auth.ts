import { db } from "@/db";
import { personalAccessTokens, users } from "@/db/schema";
import { eq, and, gt, or, isNull } from "drizzle-orm";
import { headers } from "next/headers";

export interface ApiUser {
    id: string;
    role: string;
    name: string | null;
    email: string;
}

/**
 * Validates a Personal Access Token from the Authorization header.
 * Returns the user if valid, otherwise returns null.
 */
export async function validateToken(): Promise<ApiUser | null> {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // Find the token in the database
    try {
        const results = await db
            .select({
                user: {
                    id: users.id,
                    role: users.role,
                    name: users.name,
                    email: users.email,
                },
                tokenId: personalAccessTokens.id,
                expiresAt: personalAccessTokens.expiresAt,
            })
            .from(personalAccessTokens)
            .innerJoin(users, eq(personalAccessTokens.userId, users.id))
            .where(
                and(
                    eq(personalAccessTokens.token, token),
                    or(
                        isNull(personalAccessTokens.expiresAt),
                        gt(personalAccessTokens.expiresAt, new Date())
                    )
                )
            )
            .limit(1);

        if (results.length === 0) {
            return null;
        }

        const result = results[0];

        // Update last used timestamp (background)
        db.update(personalAccessTokens)
            .set({ lastUsedAt: new Date() })
            .where(eq(personalAccessTokens.id, result.tokenId))
            .catch(() => {}); // Silent fail for background update

        return result.user as ApiUser;
    } catch (error: unknown) {
        // If table doesn't exist (42P01), just return null (token not found)
        const err = error as { code?: string; message?: string };
        if (err?.code === '42P01' || err?.message?.includes('relation "personal_access_tokens" does not exist')) {
            return null;
        }
        throw error;
    }
}

/**
 * A combined auth check that works for both Session-based (UI) 
 * and Token-based (API) requests.
 */
export async function getAuthorizedUser() {
    // 1. Try Token Auth (API)
    const apiUser = await validateToken();
    if (apiUser) return apiUser;

    // 2. Try Session Auth (UI/NextAuth)
    const { auth } = await import("@/auth");
    const session = await auth();
    
    if (session?.user) {
        return {
            id: session.user.id,
            role: session.user.role,
            name: session.user.name,
            email: session.user.email,
        } as ApiUser;
    }

    return null;
}
