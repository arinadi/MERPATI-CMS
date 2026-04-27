"use server";

import { db } from "@/db";
import { personalAccessTokens } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

/**
 * Generate a new Personal Access Token.
 */
export async function createToken(name: string, expiresDays?: number) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    // Generate a secure random token
    // Format: mc_ + 48 chars of random hex/base64
    const rawToken = "mc_" + Buffer.from(globalThis.crypto.getRandomValues(new Uint8Array(32))).toString('hex');
    
    const expiresAt = expiresDays ? new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000) : null;

    try {
        const [newToken] = await db
            .insert(personalAccessTokens)
            .values({
                userId: session.user.id,
                name,
                token: rawToken, // In a real production app, you might want to store a hash and show the raw token only once
                expiresAt,
            })
            .returning();

        // Return the raw token ONLY this once
        return { 
            id: newToken.id, 
            name: newToken.name, 
            token: rawToken, 
            expiresAt: newToken.expiresAt 
        };
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err?.code === '42P01' || err?.message?.includes('relation "personal_access_tokens" does not exist')) {
            throw new Error("Database not updated: Please run the SQL patch first.");
        }
        throw error;
    }
}

/**
 * List all tokens for the current user.
 */
export async function getTokens() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    try {
        return await db
            .select({
                id: personalAccessTokens.id,
                name: personalAccessTokens.name,
                lastUsedAt: personalAccessTokens.lastUsedAt,
                expiresAt: personalAccessTokens.expiresAt,
                createdAt: personalAccessTokens.createdAt,
            })
            .from(personalAccessTokens)
            .where(eq(personalAccessTokens.userId, session.user.id))
            .orderBy(desc(personalAccessTokens.createdAt));
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err?.code === '42P01' || err?.message?.includes('relation "personal_access_tokens" does not exist')) {
            return [];
        }
        throw error;
    }
}

/**
 * Revoke a token.
 */
export async function revokeToken(id: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    await db
        .delete(personalAccessTokens)
        .where(eq(personalAccessTokens.id, id));

    return { success: true };
}
