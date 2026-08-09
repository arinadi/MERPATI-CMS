# Reference: Drizzle ORM & Neon HTTP Database

## Overview
Drizzle ORM is a lightweight TypeScript ORM. Neon is a Serverless Postgres database. We are using the `neon-http` driver which is perfectly suited for Vercel Serverless and Edge functions since it doesn't hold persistent TCP connections.

## Installation
```bash
pnpm install drizzle-orm @neondatabase/serverless
pnpm install -D drizzle-kit
```

## Setup & Connection (`db/index.ts`)
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

## Schema Example (`db/schema.ts`)
```typescript
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: text('id').primaryKey(), // Usually UUID or Nanoid
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

## Migrations / Configuration (`drizzle.config.ts`)
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Usage in Next.js Server Actions
```typescript
'use server'
import { db } from '@/db';
import { posts } from '@/db/schema';

export async function createPost(title: string) {
  await db.insert(posts).values({ title, id: 'some-id' });
}
```

## Caveats
* Neon HTTP driver does not support interactive transactions `db.transaction(tx => ...)` in the exact same way as TCP drivers, though Drizzle has mitigations for HTTP. Complex transactions might need batching (`db.batch()`).
