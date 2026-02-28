# Library Reference: Drizzle ORM

## Overview
- **Library**: Drizzle ORM — Lightweight TypeScript ORM
- **Version**: ^0.36.0
- **Purpose**: Type-safe database queries for Neon PostgreSQL
- **NPM**: `drizzle-orm` + `drizzle-kit` (dev)

## Installation
```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

## Configuration
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Core Usage Patterns

### Select
```typescript
import { db } from '@/lib/db';
import { posts, users } from '@/lib/db/schema';
import { eq, desc, like, and, count } from 'drizzle-orm';

// Simple select
const allPosts = await db.select().from(posts);

// With conditions
const published = await db.select().from(posts)
  .where(eq(posts.status, 'published'))
  .orderBy(desc(posts.publishedAt))
  .limit(10)
  .offset(0);

// With joins
const postsWithAuthor = await db.select({
  id: posts.id,
  title: posts.title,
  authorName: users.name,
}).from(posts)
  .leftJoin(users, eq(posts.authorId, users.id));

// Count
const [{ total }] = await db.select({ total: count() }).from(posts)
  .where(eq(posts.status, 'published'));
```

### Insert
```typescript
const [newPost] = await db.insert(posts).values({
  title: 'My Post',
  slug: 'my-post',
  content: '<p>Hello</p>',
  authorId: userId,
}).returning();
```

### Update
```typescript
const [updated] = await db.update(posts)
  .set({ status: 'published', publishedAt: new Date(), publishedBy: editorId })
  .where(eq(posts.id, postId))
  .returning();
```

### Delete
```typescript
await db.delete(posts).where(eq(posts.id, postId));
```

### Transactions
```typescript
// Not available with neon-http driver
// Use multiple queries instead; keep operations atomic at app level
```

## Migration Commands
| Command | Description |
|---|---|
| `pnpm drizzle-kit generate` | Generate migration SQL from schema diff |
| `pnpm drizzle-kit migrate` | Apply pending migrations |
| `pnpm drizzle-kit push` | Push schema directly (dev only) |
| `pnpm drizzle-kit studio` | Visual DB browser at localhost:4983 |

## Known Caveats
- **No transactions with neon-http driver** — HTTP mode doesn't support transactions. Use `@neondatabase/serverless` WebSocket for transactions, but we avoid WebSocket for serverless.
- **`.returning()` is PostgreSQL-specific** — works with Neon, not with MySQL.
- **Schema changes require migration** — always run `generate` → `migrate` after schema edits.
- **Cold start**: First query in a cold serverless function incurs Drizzle initialization (~50ms).
- **Type inference**: Use `InferSelectModel<typeof posts>` and `InferInsertModel<typeof posts>` for type-safe models.
