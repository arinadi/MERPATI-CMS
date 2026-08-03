# Reference: Auth.js v5 (NextAuth)

## Overview
Auth.js v5 is the standard authentication solution for Next.js. We are configuring it to use Google OAuth exclusively, utilizing the JWT session strategy to remain fully compatible with edge computing environments.

## Installation
```bash
pnpm install next-auth@beta
```

## Setup (`auth.ts`)
```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom logic here: check if DB is initialized,
      // if not, assign Super User role.
      // If initialized, check if user exists or is invited.
      return true; // Return false to deny access
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Pass role into JWT token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
});
```

## Route Handlers (`app/api/auth/[...nextauth]/route.ts`)
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

## Middleware (`middleware.ts`)
Use middleware to protect `/admin` routes.
```typescript
export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/admin/:path*"],
}
```

## Client vs Server Usage
* **Server Components:** `const session = await auth();`
* **Client Components:** Use the `<SessionProvider>` and `useSession()`, but for this CMS admin, Server Actions and Server Components will be the primary data fetching methods, reducing client-side hooks.
