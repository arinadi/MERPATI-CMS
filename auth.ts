import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email || !account) return false;

            // Check if user already exists
            const existingUsers = await db
                .select({ status: users.status })
                .from(users)
                .where(eq(users.email, user.email));

            if (existingUsers.length > 0) {
                if (existingUsers[0].status === "suspended") return false;
                // Existing user — allow sign in
                return true;
            }

            // Check if this is the very first user (Super User claim)
            const allUsers = await db.select({ id: users.id }).from(users);

            if (allUsers.length === 0) {
                // First user → Super User
                const userId = crypto.randomUUID();
                await db.insert(users).values({
                    id: userId,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: "super_user",
                });
                await db.insert(accounts).values({
                    userId,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token ?? null,
                    access_token: account.access_token ?? null,
                    expires_at: account.expires_at ?? null,
                    token_type: account.token_type ?? null,
                    scope: account.scope ?? null,
                    id_token: account.id_token ?? null,
                    session_state: account.session_state as string ?? null,
                });
                // Claim seed posts that have no author
                const { posts } = await import("@/db/schema");
                const { isNull } = await import("drizzle-orm");
                await db.update(posts).set({ authorId: userId }).where(isNull(posts.authorId));
                return true;
            }

            // Not first user — check if they were invited (email exists in invitations)
            const { invitations } = await import("@/db/schema");
            const invitation = await db
                .select()
                .from(invitations)
                .where(eq(invitations.email, user.email));

            if (invitation.length > 0) {
                // Invited user — create account
                const userId = crypto.randomUUID();
                await db.insert(users).values({
                    id: userId,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: "user",
                });
                await db.insert(accounts).values({
                    userId,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token ?? null,
                    access_token: account.access_token ?? null,
                    expires_at: account.expires_at ?? null,
                    token_type: account.token_type ?? null,
                    scope: account.scope ?? null,
                    id_token: account.id_token ?? null,
                    session_state: account.session_state as string ?? null,
                });
                // Mark invitation as accepted
                await db
                    .update(invitations)
                    .set({ status: "accepted" })
                    .where(eq(invitations.email, user.email));

                // Trigger Telegram Alert for invited user
                const { getOption } = await import("@/lib/actions/options");
                const shouldNotify = await getOption("telegram_notify_user");
                if (shouldNotify === "true") {
                    const { sendTelegramAlert } = await import("@/lib/notifications/telegram");
                    sendTelegramAlert(`<b>New User joined the CMS:</b> ${user.email}`);
                }
                return true;
            }

            // Not invited → reject
            return false;
        },

        async jwt({ token, user }) {
            // On initial sign-in, store the email in the token
            if (user?.email) {
                token.email = user.email;
            }

            // Refresh user data from DB every 5 minutes (not every request)
            const now = Date.now();
            const lastRefresh = (token.lastRefresh as number) || 0;
            if (token.email && (now - lastRefresh > 5 * 60 * 1000 || !token.id)) {
                const dbUser = await db
                    .select({ id: users.id, role: users.role, status: users.status })
                    .from(users)
                    .where(eq(users.email, token.email as string));

                if (dbUser.length > 0) {
                    if (dbUser[0].status === "suspended") {
                        return {};
                    }
                    token.id = dbUser[0].id;
                    token.role = dbUser[0].role;
                    token.status = dbUser[0].status;
                    token.lastRefresh = now;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                (session.user as { status?: string }).status = token.status as string;
            }
            return session;
        },
    },
});
