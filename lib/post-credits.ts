import { db } from "@/db";
import { options, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// Credits live in the options table so adding them needs no schema change; one row per post and role.
const creditKey = (role: "reporter" | "editor", postId: string) => `post_${role}:${postId}`;

export type CreditInput = { reporterId?: string | null; editorId?: string | null };

/**
 * Returns an error message when a credit points to a user that does not exist.
 * `undefined`, `null` and "" mean "no credit" and are always valid.
 */
export async function findInvalidCredit({ reporterId, editorId }: CreditInput): Promise<string | null> {
    for (const [label, id] of [["Reporter", reporterId], ["Editor", editorId]] as const) {
        if (!id) continue;
        const [found] = await db.select({ id: users.id }).from(users).where(eq(users.id, id));
        if (!found) return `${label} not found`;
    }
    return null;
}

export async function getPostCredits(postId: string) {
    const rows = await db
        .select({ key: options.key, value: options.value })
        .from(options)
        .where(inArray(options.key, [creditKey("reporter", postId), creditKey("editor", postId)]));
    const valueOf = (key: string) => rows.find((r) => r.key === key)?.value ?? null;
    return {
        reporterId: valueOf(creditKey("reporter", postId)),
        editorId: valueOf(creditKey("editor", postId)),
    };
}

/** `undefined` keeps the current credit, `null` or "" removes it, an id sets it. */
export async function setPostCredits(postId: string, { reporterId, editorId }: CreditInput) {
    for (const [role, userId] of [["reporter", reporterId], ["editor", editorId]] as const) {
        if (userId === undefined) continue;
        const key = creditKey(role, postId);
        if (!userId) {
            await db.delete(options).where(eq(options.key, key));
        } else {
            await db
                .insert(options)
                .values({ key, value: userId, autoload: false })
                .onConflictDoUpdate({ target: options.key, set: { value: userId } });
        }
    }
}

export async function deletePostCredits(postIds: string[]) {
    if (postIds.length === 0) return;
    const keys = postIds.flatMap((id) => [creditKey("reporter", id), creditKey("editor", id)]);
    await db.delete(options).where(inArray(options.key, keys));
}

/** Names for the public byline; a credit whose user was deleted counts as no credit. */
export async function getPostCreditNames(postId: string) {
    const { reporterId, editorId } = await getPostCredits(postId);
    const ids = [reporterId, editorId].filter((id): id is string => !!id);
    if (ids.length === 0) return { reporter: null, editor: null };
    const found = await db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, ids));
    const nameOf = (id: string | null) => {
        const user = found.find((u) => u.id === id);
        return user ? { name: user.name } : null;
    };
    return { reporter: nameOf(reporterId), editor: nameOf(editorId) };
}
