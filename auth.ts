import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, accounts, sessions, verificationTokens, pendingInvitations } from "./db/schema";
import { eq, sql } from "drizzle-orm";

const providers: Provider[] = [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
];

if (process.env.NODE_ENV === "development") {
    // Dynamically inject a credentials bypass for local dev/browser unit testing
    providers.push(
        Credentials({
            name: "Dev Mode",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "dev@merpati.com" }
            },
            async authorize(credentials: Partial<Record<"email", unknown>>) {
                if (!credentials?.email) return null;
                let user = await db.query.users.findFirst({ where: eq(users.email, credentials.email as string) });
                if (!user) {
                    const [n] = await db.insert(users).values({
                        email: credentials.email as string,
                        name: "Browser Agent",
                        role: "super_user",
                        emailVerified: new Date()
                    }).returning();
                    user = n;
                }
                return user;
            }
        })
    );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers,
    session: { strategy: "database" },
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;
            // Jika user sudah ada di database (sudah pernah login/daftar), izinkan
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, user.email)
            });
            if (existingUser) return true;

            // Jika user belum ada, cek apakah ada undangan (invitation) untuk email tersebut
            const invite = await db.query.pendingInvitations.findFirst({
                where: eq(pendingInvitations.email, user.email)
            });
            if (invite) return true;

            // Jika belum ada user sama sekali di database (user pertama), izinkan daftar sebagai admin (super_user)
            const allUsersCount = await db.select({ count: sql<number>`count(*)` }).from(users);
            if (Number(allUsersCount[0].count) === 0) return true;

            // Selain itu, tolak akses dan arahkan ke halaman /denied
            return "/denied";
        },
        async session({ session, user }) {
            // Masukkan id dan role dari database ke dalam session NextAuth
            if (session.user && user) {
                session.user.id = user.id;
                session.user.role = (user as unknown as { role: "super_user" | "user" }).role;
            }
            return session;
        }
    },
    events: {
        async createUser({ user }) {
            if (!user.email) return;

            // Setelah user dibuat oleh DrizzleAdapter, cek apakah dia menggunakan invitation
            const invite = await db.query.pendingInvitations.findFirst({
                where: eq(pendingInvitations.email, user.email)
            });

            if (invite) {
                // Set role sesuai invitation dan hapus invitation-nya
                await db.update(users).set({ role: invite.role }).where(eq(users.id, user.id!));
                await db.delete(pendingInvitations).where(eq(pendingInvitations.email, user.email));
            } else {
                // Jika tidak ada invitation, cek apakah dia user pertama
                const allUsersCount = await db.select({ count: sql<number>`count(*)` }).from(users);
                if (Number(allUsersCount[0].count) === 1) {
                    // Jadikan Super User
                    await db.update(users).set({ role: "super_user" }).where(eq(users.id, user.id!));
                }
            }
        }
    },
    pages: {
        signIn: "/login",
        error: "/denied",
    },
});
