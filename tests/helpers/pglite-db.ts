import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { inject } from 'vitest';
import * as schema from '@/db/schema';

// Every call loads its own copy of the data dir prepared in tests/global-setup.ts, so tests never share rows.
export async function createTestDb() {
  const dataDir = new Blob([readFileSync(inject('pgliteDataDirFile'))]);
  const client = new PGlite({ loadDataDir: dataDir });
  const db = drizzle({ client, schema });
  return { db, close: () => client.close() };
}
