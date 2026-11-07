// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { like } from 'drizzle-orm';
import { options } from '@/db/schema';
import { createTestDb } from '@/tests/helpers/pglite-db';
import { addCreditPerson } from '@/lib/post-credits';

// The post-credits helpers import `db` from '@/db'; point it at the in-memory Postgres of the current test.
const current = vi.hoisted(() => ({ db: undefined as unknown }));
vi.mock('@/db', () => ({
  db: new Proxy({}, { get: (_target, prop) => Reflect.get(current.db as object, prop) }),
}));

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

let testDb: TestDb;

beforeEach(async () => {
  testDb = await createTestDb();
  current.db = testDb.db;
});

afterEach(async () => {
  await testDb.close();
});

describe('addCreditPerson with two adds at the same time', () => {
  it('stores one person when the same name is added twice at once, and both calls get that person', async () => {
    const [first, second] = await Promise.all([
      addCreditPerson('Budi Kontributor'),
      addCreditPerson('budi  kontributor'),
    ]);

    expect(second?.id).toBe(first?.id);
    const rows = await testDb.db.select().from(options).where(like(options.key, 'credit_person:%'));
    expect(rows).toHaveLength(1);
  });
});
