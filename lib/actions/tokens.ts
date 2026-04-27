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
}

/**
 * List all tokens for the current user.
 */
export async function getTokens() {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    return db
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
