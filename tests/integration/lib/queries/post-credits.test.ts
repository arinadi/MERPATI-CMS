// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { posts, users, options } from '@/db/schema';
import { createTestDb } from '@/tests/helpers/pglite-db';
import { getCachedPost } from '@/lib/queries/posts';

// The queries import `db` from '@/db'; point it at the in-memory Postgres of the current test.
const current = vi.hoisted(() => ({ db: undefined as unknown }));
vi.mock('@/db', () => ({
  db: new Proxy({}, { get: (_target, prop) => Reflect.get(current.db as object, prop) }),
}));

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

let testDb: TestDb;

beforeEach(async () => {
  testDb = await createTestDb();
  current.db = testDb.db;
  await testDb.db.insert(users).values([
    { id: 'writer', name: 'Wati Writer', email: 'w@example.com' },
    { id: 'rina', name: 'Rina Reporter', email: 'r@example.com' },
    { id: 'edo', name: 'Edo Editor', email: 'e@example.com' },
  ]);
  await testDb.db.insert(posts).values({
    id: 'p1', title: 'Story', slug: 'story', status: 'published', authorId: 'writer',
  });
});

afterEach(async () => {
  await testDb.close();
});

describe('public post credits', () => {
  it('names the reporter and the editor of a published post', async () => {
    await testDb.db.insert(options).values([
      { key: 'post_reporter:p1', value: 'rina', autoload: false },
      { key: 'post_editor:p1', value: 'edo', autoload: false },
    ]);

    const result = await getCachedPost('story');

    expect(result?.post.reporter).toEqual({ name: 'Rina Reporter' });
    expect(result?.post.editor).toEqual({ name: 'Edo Editor' });
  });

  it('has no reporter and no editor when none were chosen', async () => {
    const result = await getCachedPost('story');

    expect(result?.post.reporter).toBeNull();
    expect(result?.post.editor).toBeNull();
  });

  it('ignores a credit whose user no longer exists', async () => {
    await testDb.db.insert(options).values({ key: 'post_reporter:p1', value: 'deleted-user', autoload: false });

    const result = await getCachedPost('story');

    expect(result?.post.reporter).toBeNull();
  });

  it('does not mix up the credits of two posts', async () => {
    await testDb.db.insert(posts).values({ id: 'p2', title: 'Other', slug: 'other', status: 'published' });
    await testDb.db.insert(options).values({ key: 'post_reporter:p2', value: 'rina', autoload: false });

    const result = await getCachedPost('story');

    expect(result?.post.reporter).toBeNull();
  });
});
