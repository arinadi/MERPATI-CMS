// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { auth } from '@/auth';
import { users, options } from '@/db/schema';
import { createTestDb } from '@/tests/helpers/pglite-db';
import { createCreditPerson, getCreditPeople } from '@/lib/actions/people';

// The actions import `db` from '@/db'; point it at the in-memory Postgres of the current test.
const current = vi.hoisted(() => ({ db: undefined as unknown }));
vi.mock('@/db', () => ({
  db: new Proxy({}, { get: (_target, prop) => Reflect.get(current.db as object, prop) }),
}));

type TestDb = Awaited<ReturnType<typeof createTestDb>>;

let testDb: TestDb;

const personRows = () =>
  testDb.db.select().from(options).then((rows) => rows.filter((r) => r.key.startsWith('credit_person:')));

beforeEach(async () => {
  testDb = await createTestDb();
  current.db = testDb.db;
  await testDb.db.insert(users).values([
    { id: 'writer', name: 'Wati Writer', email: 'w@example.com' },
    { id: 'rina', name: 'Rina Reporter', email: 'r@example.com' },
    { id: 'anon', name: null, email: 'anon@example.com' },
    { id: 'gone', name: 'Suspended Sam', email: 's@example.com', status: 'suspended' },
  ]);
  vi.mocked(auth).mockResolvedValue({ user: { id: 'writer' } } as never);
});

afterEach(async () => {
  await testDb.close();
});

describe('createCreditPerson', () => {
  it('refuses a visitor who is not signed in and stores nothing', async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await createCreditPerson('Budi');

    expect(result.error).toBe('Unauthorized');
    expect(await personRows()).toHaveLength(0);
  });

  it('adds a plain-text person with the name trimmed and inner spaces collapsed', async () => {
    const result = await createCreditPerson('  Budi    Kontributor ');

    expect(result.person).toMatchObject({ name: 'Budi Kontributor', userId: null });
    expect(result.person!.id).toMatch(/^p:/);
    expect(await personRows()).toHaveLength(1);
  });

  it('rejects an empty name', async () => {
    const result = await createCreditPerson('   ');

    expect(result.error).toMatch(/name/i);
    expect(await personRows()).toHaveLength(0);
  });

  it('reuses a person with the same name, ignoring case and extra spaces', async () => {
    const first = await createCreditPerson('Budi Kontributor');
    const again = await createCreditPerson('  budi   KONTRIBUTOR');

    expect(again.person!.id).toBe(first.person!.id);
    expect(await personRows()).toHaveLength(1);
  });

  it('picks the account instead of adding a name that an account already has', async () => {
    const result = await createCreditPerson('rina reporter');

    expect(result.person).toMatchObject({ id: 'user:rina', name: 'Rina Reporter', userId: 'rina' });
    expect(await personRows()).toHaveLength(0);
  });
});

describe('getCreditPeople', () => {
  it('refuses a visitor who is not signed in', async () => {
    vi.mocked(auth).mockResolvedValue(null as never);

    const result = await getCreditPeople();

    expect(result.error).toBe('Unauthorized');
  });

  it('lists active accounts and every plain-text person, sorted by name without caring about case', async () => {
    await createCreditPerson('Budi Kontributor');

    const { people } = await getCreditPeople();

    expect(people!.map((p) => [p.id.split(':')[0], p.name])).toEqual([
      ['user', 'anon@example.com'],
      ['p', 'Budi Kontributor'],
      ['user', 'Rina Reporter'],
      ['user', 'Wati Writer'],
    ]);
  });

  it('does not offer suspended accounts', async () => {
    const { people } = await getCreditPeople();

    expect(people!.some((p) => p.id === 'user:gone')).toBe(false);
  });

  it('offers a person added on one post to every other post', async () => {
    const added = await createCreditPerson('Budi Kontributor');

    const { people } = await getCreditPeople();

    expect(people!.find((p) => p.id === added.person!.id)?.name).toBe('Budi Kontributor');
  });
});
