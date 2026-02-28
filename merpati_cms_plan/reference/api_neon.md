# API Reference: Neon Serverless PostgreSQL

## Overview
- **Service**: Neon — Serverless PostgreSQL
- **Base URL**: `postgres://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
- **Free Tier**: 0.5GB storage, 1 project, 10 branches, auto-suspend after 5 min idle
- **Driver**: `@neondatabase/serverless` (HTTP-based, no persistent connections)

## Installation
```bash
pnpm add @neondatabase/serverless drizzle-orm
pnpm add -D drizzle-kit
```

## Usage with Drizzle ORM
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Query
const posts = await db.select().from(postsTable).where(eq(postsTable.status, 'published'));
```

## Key Endpoints (Drizzle Kit CLI)
| Command | Description |
|---|---|
| `drizzle-kit generate` | Generate SQL migration from schema |
| `drizzle-kit migrate` | Apply pending migrations |
| `drizzle-kit studio` | Open visual DB browser (localhost:4983) |
| `drizzle-kit push` | Push schema directly (dev only, no migration files) |

## Rate Limits (Free Tier)
- Connection limit: Pooled (no persistent connection needed with HTTP driver)
- Compute: 191.9 compute hours/month
- Storage: 512 MB
- Branches: 10

## Error Codes
| Code | Description | Mitigation |
|---|---|---|
| `57P03` | Cannot connect (suspended) | Auto-wakes on first query (1-3s cold start) |
| `53300` | Too many connections | Use HTTP driver, not WebSocket |
| `23505` | Unique constraint violation | Handle in app (slug conflicts) |

## Caveats
- **Cold start**: First query after 5 min idle takes 1-3 seconds (Neon wakes up)
- **HTTP driver**: Each query is a separate HTTP request — batch when possible
- **No WebSocket needed**: `@neondatabase/serverless` HTTP mode is ideal for Vercel serverless
- **SSL required**: Always use `?sslmode=require` in connection string
