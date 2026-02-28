# Library Reference: Auth.js v5 (NextAuth)

## Overview
- **Library**: Auth.js v5 (formerly NextAuth.js)
- **Version**: ^5.0.0
- **Purpose**: Google OAuth authentication with JWT session strategy
- **NPM**: `next-auth`

## Installation
```bash
pnpm add next-auth
```

## Environment Variables
```bash
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=random-32-character-secret  # openssl rand -base64 32
```

## Configuration
```typescript
// auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Custom logic: check invitation, first user, etc.
      return true; // or false to deny
    },
    async jwt({ token, user, account, profile }) {
      // Add custom claims to JWT
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose custom claims in session
      session.user.id = token.userId as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});
```

## Route Handler
```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

## Usage in Server Components
```typescript
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/login');

  return <h1>Welcome, {session.user.name}</h1>;
}
```

## Usage in API Routes
```typescript
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Proceed with authenticated request
}
```

## Usage in Middleware
```typescript
// middleware.ts
import { auth } from './auth';

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});
```

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (prod)

## Known Caveats
- **JWT strategy only** — no database adapter needed (lighter for serverless)
- **Session token in httpOnly cookie** — cannot access from client JS (secure by default)
- **`NEXTAUTH_SECRET` required in production** — generate with `openssl rand -base64 32`
- **Callback URL must match exactly** — including trailing slash
- **Google profile data**: `profile.sub` = Google ID, `profile.email`, `profile.name`, `profile.picture`
- **Type augmentation needed** for custom session fields:
  ```typescript
  // types/next-auth.d.ts
  declare module 'next-auth' {
    interface Session {
      user: { id: string; role: string; } & DefaultSession['user'];
    }
  }
  ```
