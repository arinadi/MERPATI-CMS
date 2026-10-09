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

async function seedPost(id: string) {
  await testDb.db.insert(posts).values({ id, title: `Title ${id}`, slug: `slug-${id}`, authorId: 'writer' });
}

const creditKeys = async () =>
  (await testDb.db.select({ key: options.key }).from(options)).map((o) => o.key).sort();

async function creditsOf(id: string) {
  const { post } = await getPostById(id);
  return { reporterId: post?.reporterId, editorId: post?.editorId };
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
  it('saves the reporter and the editor chosen when a post is created', async () => {
    const created = await createPost({ title: 'Story', reporterId: 'rina', editorId: 'edo' });

    expect(await creditsOf(created.id!)).toEqual({ reporterId: 'rina', editorId: 'edo' });
  });

  it('has no credits when none were chosen', async () => {
    const created = await createPost({ title: 'Story' });

    expect(await creditsOf(created.id!)).toEqual({ reporterId: null, editorId: null });
    expect(await creditKeys()).toEqual([]);
  });

  it('changes a credit when the post is updated', async () => {
    const created = await createPost({ title: 'Story', reporterId: 'rina' });

    await updatePost(created.id!, { reporterId: 'edo' });

    expect((await creditsOf(created.id!)).reporterId).toBe('edo');
  });

  it('clears a credit when null is sent and removes its row', async () => {
    const created = await createPost({ title: 'Story', reporterId: 'rina', editorId: 'edo' });

    await updatePost(created.id!, { reporterId: null });

    expect(await creditsOf(created.id!)).toEqual({ reporterId: null, editorId: 'edo' });
    expect(await creditKeys()).toEqual([`post_editor:${created.id}`]);
  });

  it('keeps the credits when an update does not mention them', async () => {
    const created = await createPost({ title: 'Story', reporterId: 'rina', editorId: 'edo' });

    await updatePost(created.id!, { title: 'New title' });

    expect(await creditsOf(created.id!)).toEqual({ reporterId: 'rina', editorId: 'edo' });
  });

  it('is shown when the post is opened by its slug in the admin', async () => {
    const created = await createPost({ title: 'Story', slug: 'story', reporterId: 'rina', editorId: 'edo' });

    const { post } = await getPostBySlug('story');

    expect(post?.id).toBe(created.id);
    expect(post?.reporterId).toBe('rina');
    expect(post?.editorId).toBe('edo');
  });

  it('refuses a reporter that is not a user and stores nothing on create', async () => {
    const result = await createPost({ title: 'Story', reporterId: 'ghost' });

    expect(result.error).toMatch(/reporter/i);
    expect(await testDb.db.select().from(posts)).toHaveLength(0);
    expect(await creditKeys()).toEqual([]);
  });

  it('refuses an editor that is not a user and changes nothing on update', async () => {
    const created = await createPost({ title: 'Story', reporterId: 'rina' });

    const result = await updatePost(created.id!, { title: 'Changed', editorId: 'ghost' });

    expect(result.error).toMatch(/editor/i);
    const { post } = await getPostById(created.id!);
    expect(post?.title).toBe('Story');
    expect(await creditsOf(created.id!)).toEqual({ reporterId: 'rina', editorId: null });
  });

  it('removes the credits of a deleted post and keeps those of other posts', async () => {
    const gone = await createPost({ title: 'Gone', reporterId: 'rina', editorId: 'edo' });
    const kept = await createPost({ title: 'Kept', reporterId: 'rina' });

    await deletePost(gone.id!);

    expect(await creditKeys()).toEqual([`post_reporter:${kept.id}`]);
  });

  it('removes the credits of posts deleted in bulk and keeps those of other posts', async () => {
    const a = await createPost({ title: 'A', reporterId: 'rina' });
    const b = await createPost({ title: 'B', editorId: 'edo' });
    const c = await createPost({ title: 'C', reporterId: 'edo' });

    await bulkActionPosts([a.id!, b.id!], 'delete');

    expect(await creditKeys()).toEqual([`post_reporter:${c.id}`]);
  });

  it('does not touch credits when posts are only published in bulk', async () => {
    await seedPost('p1');
    const created = await createPost({ title: 'Story', reporterId: 'rina' });

    await bulkActionPosts([created.id!, 'p1'], 'publish');

    expect(await creditsOf(created.id!)).toEqual({ reporterId: 'rina', editorId: null });
  });
});
