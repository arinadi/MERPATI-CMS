import { db } from "@/db";
import { options, users } from "@/db/schema";
import { eq, inArray, like } from "drizzle-orm";
import { createHash } from "node:crypto";

// Credits live in the options table so adding them needs no schema change.
// A person is either an account ("user:<userId>", name read live from users) or a plain-text name
// ("p:<uuid>", one `credit_person:<uuid>` row each so two people adding names at once cannot overwrite each other).
const USER_PREFIX = "user:";
const PERSON_PREFIX = "p:";
const PERSON_ROW = "credit_person:";

// Shown in the admin picker for an account with no name. The email is never used as a name:
// it would be visible to every logged-in user in the picker.
const NO_NAME_LABEL = "(no name)";

type Role = "reporter" | "editor";
const listKey = (role: Role, postId: string) => `post_${role}s:${postId}`;
// Version 1 stored one user id per role under this key; it is still read and removed on the next save.
const legacyKey = (role: Role, postId: string) => `post_${role}:${postId}`;

export type CreditPerson = { id: string; name: string; userId: string | null };
export type CreditInput = { reporterIds?: string[]; editorIds?: string[] };

export function normalizePersonName(name: string) {
    return name.trim().replace(/\s+/g, " ");
}

const sameName = (a: string, b: string) => normalizePersonName(a).toLowerCase() === normalizePersonName(b).toLowerCase();

// An account without a name is listed under NO_NAME_LABEL, so a typed "(no name)" must not select it.
const isNamelessAccount = (person: CreditPerson) => person.userId !== null && person.name === NO_NAME_LABEL;

// Same normalization as sameName, so one name always maps to one key whatever the spacing or case typed.
const personKeyFor = (name: string) =>
    `${PERSON_ROW}${createHash("sha256").update(normalizePersonName(name).toLowerCase()).digest("hex")}`;

const isPersonPayload = (value: unknown): value is { name: string } =>
    typeof value === "object" && value !== null && typeof (value as { name?: unknown }).name === "string";

const isIdList = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((id) => typeof id === "string");

// One bad row must not take the public post down, so it is logged with its key and skipped.
function readRow<T>(key: string, value: string, isValid: (parsed: unknown) => parsed is T): T | null {
    let parsed: unknown;
    try {
        parsed = JSON.parse(value);
    } catch {
        console.error(`Credit row ${key} is not valid JSON; it is skipped.`);
        return null;
    }
    if (isValid(parsed)) return parsed;
    console.error(`Credit row ${key} has an unexpected shape; it is skipped.`);
    return null;
}

const rowToPerson = (key: string, value: string): CreditPerson | null => {
    const payload = readRow(key, value, isPersonPayload);
    return payload ? { id: `${PERSON_PREFIX}${key.slice(PERSON_ROW.length)}`, name: payload.name, userId: null } : null;
};

/** Accounts that exist, and plain-text people whose row exists, among `ids`. */
async function findKnownIds(ids: string[]): Promise<Set<string>> {
    const userIds = ids.filter((id) => id.startsWith(USER_PREFIX)).map((id) => id.slice(USER_PREFIX.length));
    const personRows = ids.filter((id) => id.startsWith(PERSON_PREFIX)).map((id) => `${PERSON_ROW}${id.slice(PERSON_PREFIX.length)}`);
    const [foundUsers, foundPeople] = await Promise.all([
        userIds.length ? db.select({ id: users.id }).from(users).where(inArray(users.id, userIds)) : [],
        personRows.length ? db.select({ key: options.key }).from(options).where(inArray(options.key, personRows)) : [],
    ]);
    return new Set([
        ...foundUsers.map((u) => `${USER_PREFIX}${u.id}`),
        ...foundPeople.map((p) => `${PERSON_PREFIX}${p.key.slice(PERSON_ROW.length)}`),
    ]);
}

/**
 * Returns an error message when a role has more than one person, or when a credit points to an
 * account or person that does not exist. `undefined` and `[]` mean "no credit" and are always valid.
 * One person per role is enforced here, so both create and update refuse a second one.
 */
export async function findInvalidCredit({ reporterIds, editorIds }: CreditInput): Promise<string | null> {
    const known = await findKnownIds([...(reporterIds ?? []), ...(editorIds ?? [])]);
    for (const [label, ids] of [["Reporter", reporterIds], ["Editor", editorIds]] as const) {
        if (ids && ids.length > 1) return `${label}: only one person can be chosen`;
        if (ids?.some((id) => !known.has(id))) return `${label} not found`;
    }
    return null;
}

/** Everyone who can be credited: active accounts plus every plain-text person, sorted by name. */
export async function listCreditPeople(): Promise<CreditPerson[]> {
    const [accounts, rows] = await Promise.all([
        db.select({ id: users.id, name: users.name, status: users.status }).from(users),
        db.select({ key: options.key, value: options.value }).from(options).where(like(options.key, `${PERSON_ROW}%`)),
    ]);
    const people: CreditPerson[] = [
        ...accounts
            .filter((u) => u.status === "active")
            .map((u) => ({ id: `${USER_PREFIX}${u.id}`, name: u.name || NO_NAME_LABEL, userId: u.id })),
        ...rows.flatMap((r) => {
            const person = rowToPerson(r.key, r.value);
            return person ? [person] : [];
        }),
    ];
    return people.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}

/** Adds a plain-text person, or returns the one (account or name) that already has this name. */
export async function addCreditPerson(rawName: string): Promise<CreditPerson | null> {
    const name = normalizePersonName(rawName);
    if (!name) return null;

    const existing = (await listCreditPeople()).find((p) => !isNamelessAccount(p) && sameName(p.name, name));
    if (existing) return existing;

    // The key is derived from the name, not random: two concurrent adds of one name hit the same primary key,
    // so only the first insert stores a row and both calls read back the same person.
    const key = personKeyFor(name);
    await db.insert(options).values({ key, value: JSON.stringify({ name }), autoload: false }).onConflictDoNothing({ target: options.key });
    const [row] = await db.select({ key: options.key, value: options.value }).from(options).where(eq(options.key, key));
    return row ? rowToPerson(row.key, row.value) : null;
}

export async function getPostCredits(postId: string) {
    const keys = (["reporter", "editor"] as const).flatMap((role) => [listKey(role, postId), legacyKey(role, postId)]);
    const rows = await db.select({ key: options.key, value: options.value }).from(options).where(inArray(options.key, keys));
    const valueOf = (key: string) => rows.find((r) => r.key === key)?.value;
    const idsOf = (role: Role): string[] => {
        const list = valueOf(listKey(role, postId));
        if (list !== undefined) return readRow(listKey(role, postId), list, isIdList) ?? [];
        const legacy = valueOf(legacyKey(role, postId));
        return legacy ? [`${USER_PREFIX}${legacy}`] : [];
    };
    return { reporterIds: idsOf("reporter"), editorIds: idsOf("editor") };
}

/** `undefined` keeps the current list, `[]` removes it, otherwise the list is replaced. */
export async function setPostCredits(postId: string, { reporterIds, editorIds }: CreditInput) {
    // The new list row is written before the legacy row is removed. If the write fails in between,
    // the previous credit is still readable from the legacy row instead of being lost.
    for (const [role, ids] of [["reporter", reporterIds], ["editor", editorIds]] as const) {
        if (ids === undefined) continue;
        if (ids.length === 0) {
            await db.delete(options).where(inArray(options.key, [listKey(role, postId), legacyKey(role, postId)]));
        } else {
            await db
                .insert(options)
                .values({ key: listKey(role, postId), value: JSON.stringify(ids), autoload: false })
                .onConflictDoUpdate({ target: options.key, set: { value: JSON.stringify(ids) } });
            await db.delete(options).where(eq(options.key, legacyKey(role, postId)));
        }
    }
}

export async function deletePostCredits(postIds: string[]) {
    if (postIds.length === 0) return;
    const keys = postIds.flatMap((id) =>
        (["reporter", "editor"] as const).flatMap((role) => [listKey(role, id), legacyKey(role, id)])
    );
    await db.delete(options).where(inArray(options.key, keys));
}

/**
 * Names for the public byline, in the order they were chosen. A person that no longer exists is left out,
 * and so is an account without a name: the email must never reach the public page.
 */
export async function getPostCreditNames(postId: string) {
    const { reporterIds, editorIds } = await getPostCredits(postId);
    const ids = [...new Set([...reporterIds, ...editorIds])];
    const userIds = ids.filter((id) => id.startsWith(USER_PREFIX)).map((id) => id.slice(USER_PREFIX.length));
    const personRows = ids.filter((id) => id.startsWith(PERSON_PREFIX)).map((id) => `${PERSON_ROW}${id.slice(PERSON_PREFIX.length)}`);
    const [accounts, rows] = await Promise.all([
        userIds.length ? db.select({ id: users.id, name: users.name }).from(users).where(inArray(users.id, userIds)) : [],
        personRows.length ? db.select({ key: options.key, value: options.value }).from(options).where(inArray(options.key, personRows)) : [],
    ]);
    const names = new Map<string, string | null>([
        ...accounts.map((u) => [`${USER_PREFIX}${u.id}`, u.name] as const),
        ...rows.flatMap((r) => {
            const person = rowToPerson(r.key, r.value);
            return person ? [[person.id, person.name] as const] : [];
        }),
    ]);
    const namesOf = (list: string[]) =>
        list.flatMap((id) => { const name = names.get(id); return name ? [{ name }] : []; });
    return { reporters: namesOf(reporterIds), editors: namesOf(editorIds) };
}
