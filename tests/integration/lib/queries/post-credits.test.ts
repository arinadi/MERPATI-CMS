// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
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

const setCredits = (key: string, ids: string[]) =>
  testDb.db.insert(options).values({ key, value: JSON.stringify(ids), autoload: false });

beforeEach(async () => {
  testDb = await createTestDb();
  current.db = testDb.db;
  await testDb.db.insert(users).values([
    { id: 'writer', name: 'Wati Writer', email: 'w@example.com' },
    { id: 'rina', name: 'Rina Reporter', email: 'r@example.com' },
    { id: 'edo', name: 'Edo Editor', email: 'e@example.com' },
    { id: 'anon', name: null, email: 'secret@example.com' },
  ]);
  await testDb.db.insert(options).values({
    key: 'credit_person:b1', value: JSON.stringify({ name: 'Budi Kontributor' }), autoload: false,
  });
  await testDb.db.insert(posts).values({
    id: 'p1', title: 'Story', slug: 'story', status: 'published', authorId: 'writer',
  });
});

afterEach(async () => {
  await testDb.close();
});

describe('public post credits', () => {
  it('names every reporter and editor, accounts and plain-text names, in order', async () => {
    await setCredits('post_reporters:p1', ['p:b1', 'user:rina']);
    await setCredits('post_editors:p1', ['user:edo']);

    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([{ name: 'Budi Kontributor' }, { name: 'Rina Reporter' }]);
    expect(result?.post.editors).toEqual([{ name: 'Edo Editor' }]);
  });

  it('has empty lists when none were chosen', async () => {
    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([]);
    expect(result?.post.editors).toEqual([]);
  });

  it('leaves out an account that no longer exists', async () => {
    await setCredits('post_reporters:p1', ['user:deleted', 'user:rina']);

    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([{ name: 'Rina Reporter' }]);
  });

  it('leaves out a plain-text person that no longer exists', async () => {
    await setCredits('post_reporters:p1', ['p:gone']);

    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([]);
  });

  it('never shows the email of an account that has no name', async () => {
    await setCredits('post_editors:p1', ['user:anon']);

    const result = await getCachedPost('story');

    expect(result?.post.editors).toEqual([]);
  });

  it('shows the new name of an account after it was renamed', async () => {
    await setCredits('post_reporters:p1', ['user:rina']);
    await testDb.db.update(users).set({ name: 'Rina Baru' }).where(eq(users.id, 'rina'));

    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([{ name: 'Rina Baru' }]);
  });

  it('still shows credits saved by the first version', async () => {
    await testDb.db.insert(options).values([
      { key: 'post_reporter:p1', value: 'rina', autoload: false },
      { key: 'post_editor:p1', value: 'edo', autoload: false },
    ]);

    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([{ name: 'Rina Reporter' }]);
    expect(result?.post.editors).toEqual([{ name: 'Edo Editor' }]);
  });

  it('does not mix up the credits of two posts', async () => {
    await testDb.db.insert(posts).values({ id: 'p2', title: 'Other', slug: 'other', status: 'published' });
    await setCredits('post_reporters:p2', ['user:rina']);

    const result = await getCachedPost('story');

    expect(result?.post.reporters).toEqual([]);
  });
});
