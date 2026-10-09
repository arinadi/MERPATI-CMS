// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { posts, users, postRelationships } from '@/db/schema';
import { createTestDb } from '@/tests/helpers/pglite-db';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  bulkActionPosts,
} from '@/lib/actions/posts';

// The actions import `db` from '@/db'; point it at the in-memory Postgres of the current test.
const current = vi.hoisted(() => ({ db: undefined as unknown }));
vi.mock('@/db', () => ({
  db: new Proxy({}, { get: (_target, prop) => Reflect.get(current.db as object, prop) }),
}));

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

let testDb: TestDb;

const signInAs = (id: string) =>
  vi.mocked(auth).mockResolvedValue({ user: { id } } as never);

async function seedUser(id: string, name = id) {
  await testDb.db.insert(users).values({ id, name, email: `${id}@example.com` });
}

async function seedPost(values: Partial<typeof posts.$inferInsert> & { id: string }) {
  await testDb.db.insert(posts).values({
    title: `Title ${values.id}`,
    slug: `slug-${values.id}`,
    ...values,
  });
}

const allPosts = () => testDb.db.select().from(posts);
const postById = async (id: string) =>
  (await testDb.db.select().from(posts).where(eq(posts.id, id)))[0];

beforeEach(async () => {
  testDb = await createTestDb();
  current.db = testDb.db;
  await seedUser('writer', 'Wati Writer');
  signInAs('writer');
});

afterEach(async () => {
  await testDb.close();
});

describe('getPosts', () => {
  it('returns only items of the requested type', async () => {
    await seedPost({ id: 'a', type: 'post' });
    await seedPost({ id: 'b', type: 'page' });

    const result = await getPosts('page');

    expect(result.items.map((p) => p.id)).toEqual(['b']);
    expect(result.total).toBe(1);
  });

  it('filters by status', async () => {
    await seedPost({ id: 'a', status: 'published' });
    await seedPost({ id: 'b', status: 'draft' });

    const published = await getPosts('post', 1, 20, undefined, 'published');
    const drafts = await getPosts('post', 1, 20, undefined, 'draft');
    const everything = await getPosts('post', 1, 20, undefined, 'all');

    expect(published.items.map((p) => p.id)).toEqual(['a']);
    expect(drafts.items.map((p) => p.id)).toEqual(['b']);
    expect(everything.total).toBe(2);
  });

  it('searches the title without caring about case', async () => {
    await seedPost({ id: 'a', title: 'Banjir di Jakarta' });
    await seedPost({ id: 'b', title: 'Pemilu 2029' });

    const result = await getPosts('post', 1, 20, 'BANJIR');

    expect(result.items.map((p) => p.id)).toEqual(['a']);
    expect(result.total).toBe(1);
  });

  it('sorts by title in the requested direction', async () => {
    await seedPost({ id: 'b', title: 'Bravo' });
    await seedPost({ id: 'a', title: 'Alpha' });
    await seedPost({ id: 'c', title: 'Charlie' });

    const ascending = await getPosts('post', 1, 20, undefined, 'all', 'title', 'asc');
    const descending = await getPosts('post', 1, 20, undefined, 'all', 'title', 'desc');

    expect(ascending.items.map((p) => p.title)).toEqual(['Alpha', 'Bravo', 'Charlie']);
    expect(descending.items.map((p) => p.title)).toEqual(['Charlie', 'Bravo', 'Alpha']);
  });

  it('returns the requested page and the total number of pages', async () => {
    for (const n of [1, 2, 3, 4, 5]) {
      await seedPost({ id: `p${n}`, title: `Post ${n}` });
    }

    const result = await getPosts('post', 2, 2, undefined, 'all', 'title', 'asc');

    expect(result.items.map((p) => p.title)).toEqual(['Post 3', 'Post 4']);
    expect(result.total).toBe(5);
    expect(result.totalPages).toBe(3);
  });

  it('shows the name of the author', async () => {
    await seedPost({ id: 'a', authorId: 'writer' });

    const result = await getPosts('post');

    expect(result.items[0].authorName).toBe('Wati Writer');
  });
});

describe('createPost', () => {
  it('refuses a visitor who is not signed in and stores nothing', async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await createPost({ title: 'Secret' });

    expect(result.error).toBe('Unauthorized');
    expect(await allPosts()).toHaveLength(0);
  });

  it('saves a draft post owned by the signed-in user by default', async () => {
    const result = await createPost({ title: 'Hello' });

    const saved = await postById(result.id!);
    expect(saved.authorId).toBe('writer');
    expect(saved.status).toBe('draft');
    expect(saved.type).toBe('post');
  });

  it('builds the slug from the title when none is given', async () => {
    const result = await createPost({ title: 'Hello World!' });

    expect(result.slug).toBe('hello-world');
    expect((await postById(result.id!)).slug).toBe('hello-world');
  });

  it('does not reuse a slug that is already taken', async () => {
    const first = await createPost({ title: 'Same', slug: 'same' });
    const second = await createPost({ title: 'Same again', slug: 'same' });

    expect(first.slug).toBe('same');
    expect(second.slug).not.toBe('same');
    expect(await allPosts()).toHaveLength(2);
  });

  it('removes scripts and event handlers from the content before saving', async () => {
    const result = await createPost({
      title: 'Xss',
      content: '<p onclick="steal()">Safe text</p><script>alert(1)</script>',
    });

    const saved = await postById(result.id!);
    expect(saved.content).toContain('Safe text');
    expect(saved.content).not.toContain('<script');
    expect(saved.content).not.toContain('onclick');
  });

  it('takes the excerpt from the first paragraph when none is given', async () => {
    const result = await createPost({
      title: 'With excerpt',
      content: '<h2>Heading</h2><p>First <strong>paragraph</strong> here.</p><p>Second.</p>',
    });

    expect((await postById(result.id!)).excerpt).toBe('First paragraph here.');
  });

  it('rejects a post without a title and stores nothing', async () => {
    const result = await createPost({ title: '' });

    expect(result.error).toMatch(/required/i);
    expect(await allPosts()).toHaveLength(0);
  });

  it('links the related posts that were chosen', async () => {
    await seedPost({ id: 'other' });

    const result = await createPost({ title: 'Main', relatedPostIds: ['other'] });

    const links = await testDb.db.select().from(postRelationships);
    expect(links).toEqual([{ postId: result.id, relatedPostId: 'other' }]);
  });
});

describe('updatePost', () => {
  it('changes the title and publishes the post', async () => {
    await seedPost({ id: 'a', title: 'Old', status: 'draft' });

    const result = await updatePost('a', { title: 'New', status: 'published' });

    expect(result.success).toBe(true);
    const saved = await postById('a');
    expect(saved.title).toBe('New');
    expect(saved.status).toBe('published');
  });

  it('leaves fields that were not sent as they are', async () => {
    await seedPost({ id: 'a', title: 'Keep me', slug: 'keep', status: 'published' });

    await updatePost('a', { excerpt: 'Short' });

    const saved = await postById('a');
    expect(saved.title).toBe('Keep me');
    expect(saved.slug).toBe('keep');
    expect(saved.status).toBe('published');
    expect(saved.excerpt).toBe('Short');
  });

  it('refuses a slug that another post already uses and keeps the old one', async () => {
    await seedPost({ id: 'a', slug: 'first' });
    await seedPost({ id: 'b', slug: 'second' });

    const result = await updatePost('b', { slug: 'first' });

    expect(result.error).toBe('Slug is already in use');
    expect((await postById('b')).slug).toBe('second');
  });

  it('accepts the slug the post already has', async () => {
    await seedPost({ id: 'a', slug: 'mine' });

    const result = await updatePost('a', { slug: 'mine', title: 'Renamed' });

    expect(result.success).toBe(true);
    expect((await postById('a')).title).toBe('Renamed');
  });

  it('removes scripts from the content before saving', async () => {
    await seedPost({ id: 'a' });

    await updatePost('a', { content: '<p>Fine</p><script>alert(1)</script>' });

    const saved = await postById('a');
    expect(saved.content).toContain('Fine');
    expect(saved.content).not.toContain('<script');
  });

  it('replaces the related posts with the new list', async () => {
    await seedPost({ id: 'a' });
    await seedPost({ id: 'x' });
    await seedPost({ id: 'y' });
    await updatePost('a', { relatedPostIds: ['x'] });

    await updatePost('a', { relatedPostIds: ['y'] });

    const links = await testDb.db.select().from(postRelationships);
    expect(links).toEqual([{ postId: 'a', relatedPostId: 'y' }]);
  });

  it('reports a post that does not exist', async () => {
    const result = await updatePost('missing', { title: 'Nope' });

    expect(result.error).toBe('Post not found');
  });

  it('refuses a visitor who is not signed in and changes nothing', async () => {
    await seedPost({ id: 'a', title: 'Original' });
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await updatePost('a', { title: 'Hacked' });

    expect(result.error).toBe('Unauthorized');
    expect((await postById('a')).title).toBe('Original');
  });
});

describe('deletePost', () => {
  it('removes the post and its related-post links, and leaves other posts', async () => {
    await seedPost({ id: 'a' });
    await seedPost({ id: 'b' });
    await testDb.db.insert(postRelationships).values({ postId: 'a', relatedPostId: 'b' });

    const result = await deletePost('a');

    expect(result.success).toBe(true);
    expect((await allPosts()).map((p) => p.id)).toEqual(['b']);
    expect(await testDb.db.select().from(postRelationships)).toHaveLength(0);
  });

  it('reports a post that does not exist', async () => {
    const result = await deletePost('missing');

    expect(result.error).toBe('Post not found');
  });

  it('refuses a visitor who is not signed in and deletes nothing', async () => {
    await seedPost({ id: 'a' });
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await deletePost('a');

    expect(result.error).toBe('Unauthorized');
    expect(await allPosts()).toHaveLength(1);
  });
});

describe('bulkActionPosts', () => {
  it('publishes only the selected posts', async () => {
    await seedPost({ id: 'a', status: 'draft' });
    await seedPost({ id: 'b', status: 'draft' });

    const result = await bulkActionPosts(['a'], 'publish');

    expect(result.success).toBe(true);
    expect((await postById('a')).status).toBe('published');
    expect((await postById('b')).status).toBe('draft');
  });

  it('moves the selected posts back to draft', async () => {
    await seedPost({ id: 'a', status: 'published' });

    await bulkActionPosts(['a'], 'draft');

    expect((await postById('a')).status).toBe('draft');
  });

  it('deletes only the selected posts', async () => {
    await seedPost({ id: 'a' });
    await seedPost({ id: 'b' });
    await seedPost({ id: 'c' });

    await bulkActionPosts(['a', 'b'], 'delete');

    expect((await allPosts()).map((p) => p.id)).toEqual(['c']);
  });

  it('does not touch items of the other type', async () => {
    await seedPost({ id: 'post-1', type: 'post', status: 'draft' });
    await seedPost({ id: 'page-1', type: 'page', status: 'draft' });

    await bulkActionPosts(['post-1', 'page-1'], 'publish', 'page');
    await bulkActionPosts(['post-1', 'page-1'], 'delete', 'page');

    expect((await postById('post-1')).status).toBe('draft');
    expect(await postById('page-1')).toBeUndefined();
  });

  it('asks for a selection when no ids are given', async () => {
    await seedPost({ id: 'a' });

    const result = await bulkActionPosts([], 'delete');

    expect(result.error).toBe('No items selected');
    expect(await allPosts()).toHaveLength(1);
  });

  it('refuses a visitor who is not signed in and changes nothing', async () => {
    await seedPost({ id: 'a', status: 'draft' });
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await bulkActionPosts(['a'], 'publish');

    expect(result.error).toBe('Unauthorized');
    expect((await postById('a')).status).toBe('draft');
  });
});
