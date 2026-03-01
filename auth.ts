import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        })
    ],
    callbacks: {
        async signIn() {
            // Mock validation logic
            // In reality: Check DB for user, if not exists and count == 0, create Super User
            // If count > 0, check if invited. If not, return false
            return true;
        },
        async session({ session }) {
            // Add role to session for middleware checks
            if (session.user) {
                (session.user as unknown as { role: string }).role = 'super_user'; // Mock role
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login', // Error code passed in query string as ?error=
    }
});
