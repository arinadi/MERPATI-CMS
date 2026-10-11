// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth } from '@/auth';
import { posts, users, options } from '@/db/schema';
import { createTestDb } from '@/tests/helpers/pglite-db';
import {
  createPost,
  updatePost,
  deletePost,
  bulkActionPosts,
  getPostById,
  getPostBySlug,
} from '@/lib/actions/posts';
import { createCreditPerson } from '@/lib/actions/people';

// The actions import `db` from '@/db'; point it at the in-memory Postgres of the current test.
const current = vi.hoisted(() => ({ db: undefined as unknown }));
vi.mock('@/db', () => ({
  db: new Proxy({}, { get: (_target, prop) => Reflect.get(current.db as object, prop) }),
}));

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

let testDb: TestDb;

async function seedUser(id: string) {
  await testDb.db.insert(users).values({ id, name: `Name ${id}`, email: `${id}@example.com` });
}

const creditKeys = async () =>
  (await testDb.db.select({ key: options.key }).from(options))
    .map((o) => o.key)
    .filter((key) => !key.startsWith('credit_person:'))
    .sort();

async function creditsOf(id: string) {
  const { post } = await getPostById(id);
  return { reporterIds: post?.reporterIds, editorIds: post?.editorIds };
}

// A plain-text person, created the way the editor does it.
async function addPerson(name: string) {
  const result = await createCreditPerson(name);
  return result.person!.id;
}

beforeEach(async () => {
  testDb = await createTestDb();
  current.db = testDb.db;
  await seedUser('writer');
  await seedUser('rina');
  await seedUser('edo');
  vi.mocked(auth).mockResolvedValue({ user: { id: 'writer' } } as never);
});

afterEach(async () => {
  await testDb.close();
});

describe('post credits', () => {
  it('saves several reporters and editors, accounts and plain-text names, in the order given', async () => {
    const budi = await addPerson('Budi Kontributor');

    const created = await createPost({
      title: 'Story',
      reporterIds: [budi, 'user:rina'],
      editorIds: ['user:edo'],
    });

    expect(await creditsOf(created.id!)).toEqual({
      reporterIds: [budi, 'user:rina'],
      editorIds: ['user:edo'],
    });
  });

  it('has no credits when none were chosen', async () => {
    const created = await createPost({ title: 'Story' });

    expect(await creditsOf(created.id!)).toEqual({ reporterIds: [], editorIds: [] });
    expect(await creditKeys()).toEqual([]);
  });

  it('replaces the whole list when the post is updated', async () => {
    const created = await createPost({ title: 'Story', reporterIds: ['user:rina', 'user:edo'] });

    await updatePost(created.id!, { reporterIds: ['user:edo'] });

    expect((await creditsOf(created.id!)).reporterIds).toEqual(['user:edo']);
  });

  it('clears a list when an empty array is sent and removes its row', async () => {
    const created = await createPost({ title: 'Story', reporterIds: ['user:rina'], editorIds: ['user:edo'] });

    await updatePost(created.id!, { reporterIds: [] });

    expect(await creditsOf(created.id!)).toEqual({ reporterIds: [], editorIds: ['user:edo'] });
    expect(await creditKeys()).toEqual([`post_editors:${created.id}`]);
  });

  it('keeps the credits when an update does not mention them', async () => {
    const created = await createPost({ title: 'Story', reporterIds: ['user:rina'], editorIds: ['user:edo'] });

    await updatePost(created.id!, { title: 'New title' });

    expect(await creditsOf(created.id!)).toEqual({ reporterIds: ['user:rina'], editorIds: ['user:edo'] });
  });

  it('is shown when the post is opened by its slug in the admin', async () => {
    const created = await createPost({ title: 'Story', slug: 'story', reporterIds: ['user:rina'], editorIds: ['user:edo'] });

    const { post } = await getPostBySlug('story');

    expect(post?.id).toBe(created.id);
    expect(post?.reporterIds).toEqual(['user:rina']);
    expect(post?.editorIds).toEqual(['user:edo']);
  });

  it('reuses the same plain-text person on another post', async () => {
    const budi = await addPerson('Budi Kontributor');
    const first = await createPost({ title: 'One', reporterIds: [budi] });
    const second = await createPost({ title: 'Two', editorIds: [budi] });

    expect((await creditsOf(first.id!)).reporterIds).toEqual([budi]);
    expect((await creditsOf(second.id!)).editorIds).toEqual([budi]);
  });

  it('refuses a reporter that is not a user or a person and stores nothing on create', async () => {
    const result = await createPost({ title: 'Story', reporterIds: ['user:rina', 'user:ghost'] });

    expect(result.error).toMatch(/reporter/i);
    expect(await testDb.db.select().from(posts)).toHaveLength(0);
    expect(await creditKeys()).toEqual([]);
  });

  it('refuses an unknown plain-text person and changes nothing on update', async () => {
    const created = await createPost({ title: 'Story', reporterIds: ['user:rina'] });

    const result = await updatePost(created.id!, { title: 'Changed', editorIds: ['p:missing'] });

    expect(result.error).toMatch(/editor/i);
    const { post } = await getPostById(created.id!);
    expect(post?.title).toBe('Story');
    expect(await creditsOf(created.id!)).toEqual({ reporterIds: ['user:rina'], editorIds: [] });
  });

  it('refuses an id that is neither user:<id> nor p:<id>', async () => {
    const result = await createPost({ title: 'Story', reporterIds: ['rina'] });

    expect(result.error).toMatch(/reporter/i);
    expect(await testDb.db.select().from(posts)).toHaveLength(0);
  });

  it('removes the credits of a deleted post and keeps those of other posts', async () => {
    const gone = await createPost({ title: 'Gone', reporterIds: ['user:rina'], editorIds: ['user:edo'] });
    const kept = await createPost({ title: 'Kept', reporterIds: ['user:rina'] });

    await deletePost(gone.id!);

    expect(await creditKeys()).toEqual([`post_reporters:${kept.id}`]);
  });

  it('removes the credits of posts deleted in bulk and keeps those of other posts', async () => {
    const a = await createPost({ title: 'A', reporterIds: ['user:rina'] });
    const b = await createPost({ title: 'B', editorIds: ['user:edo'] });
    const c = await createPost({ title: 'C', reporterIds: ['user:edo'] });

    await bulkActionPosts([a.id!, b.id!], 'delete');

    expect(await creditKeys()).toEqual([`post_reporters:${c.id}`]);
  });

  it('does not touch credits when posts are only published in bulk', async () => {
    const created = await createPost({ title: 'Story', reporterIds: ['user:rina'] });

    await bulkActionPosts([created.id!], 'publish');

    expect(await creditsOf(created.id!)).toEqual({ reporterIds: ['user:rina'], editorIds: [] });
  });
});

describe('credits saved by the first version', () => {
  async function seedLegacyPost() {
    await testDb.db.insert(posts).values({ id: 'old', title: 'Old', slug: 'old', authorId: 'writer' });
    await testDb.db.insert(options).values([
      { key: 'post_reporter:old', value: 'rina', autoload: false },
      { key: 'post_editor:old', value: 'edo', autoload: false },
    ]);
  }

  it('are still read, as accounts', async () => {
    await seedLegacyPost();

    expect(await creditsOf('old')).toEqual({ reporterIds: ['user:rina'], editorIds: ['user:edo'] });
  });

  it('are replaced by the new rows the next time the credits are saved', async () => {
    await seedLegacyPost();

    await updatePost('old', { reporterIds: ['user:rina', 'user:edo'] });

    expect(await creditsOf('old')).toEqual({ reporterIds: ['user:rina', 'user:edo'], editorIds: ['user:edo'] });
    expect(await creditKeys()).toEqual(['post_editor:old', 'post_reporters:old']);
  });

  it('are removed together with the post', async () => {
    await seedLegacyPost();

    await deletePost('old');

    expect(await creditKeys()).toEqual([]);
  });
});
