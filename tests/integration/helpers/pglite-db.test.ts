// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { createTestDb } from '@/tests/helpers/pglite-db';
import { users, posts } from '@/db/schema';

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

describe('createTestDb', () => {
  let testDb: TestDb | undefined;

  afterEach(async () => {
    await testDb?.close();
    testDb = undefined;
  });

  it('gives a database with the tables from db/init.sql', async () => {
    testDb = await createTestDb();
    await testDb.db.insert(users).values({ id: 'u1', email: 'a@example.com' });
    await testDb.db.insert(posts).values({ id: 'p1', title: 'Hello', slug: 'hello', authorId: 'u1' });

    const [row] = await testDb.db.select().from(posts).where(eq(posts.id, 'p1'));

    expect(row.title).toBe('Hello');
    expect(row.status).toBe('draft');
  });

  it('enforces the constraints of init.sql, so a duplicate slug is rejected', async () => {
    testDb = await createTestDb();
    await testDb.db.insert(posts).values({ id: 'p1', title: 'One', slug: 'same' });

    await expect(
      testDb.db.insert(posts).values({ id: 'p2', title: 'Two', slug: 'same' })
    ).rejects.toThrow();
  });

  it('gives every call its own empty database', async () => {
    const first = await createTestDb();
    await first.db.insert(posts).values({ id: 'p1', title: 'One', slug: 'one' });
    await first.close();

    testDb = await createTestDb();
    const rows = await testDb.db.select().from(posts);

    expect(rows).toHaveLength(0);
  });
});
