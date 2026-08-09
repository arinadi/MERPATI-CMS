import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

let _db: NeonHttpDatabase | null = null;

export function getDb(): NeonHttpDatabase {
    if (!_db) {
        const sql = neon(process.env.DATABASE_URL!);
        _db = drizzle({ client: sql });
    }
    return _db;
}

// Proxy-based export for convenience — lazily initializes on first use
export const db = new Proxy({} as NeonHttpDatabase, {
    get(_target, prop) {
        return Reflect.get(getDb(), prop);
    },
});
