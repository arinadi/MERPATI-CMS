import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/drizzle/schema';

// If a connection string isn't provided, use a placeholder so build doesn't crash
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
