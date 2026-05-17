import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';

// Mocking Next.js features
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '',
  redirect: vi.fn((url) => {
    const error = new Error('NEXT_REDIRECT');
    (error as any).digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw error;
  }),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Map()),
  cookies: vi.fn(async () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock('next/server', () => {
  class MockNextRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      super(input, init);
    }
  }
  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: vi.fn((data, init) => ({
        data,
        status: init?.status || 200,
        headers: new Map(Object.entries(init?.headers || {})),
      })),
      redirect: vi.fn((url) => ({
        status: 307,
        headers: new Map([['location', url.toString()]]),
      })),
    },
  };
});

vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
  handlers: { GET: vi.fn(), POST: vi.fn() },
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { dbMock } from './mocks/db';

vi.mock('@/db', () => ({
  db: new Proxy({}, {
    get: (_target, prop) => {
      return (dbMock as any)[prop] || dbMock;
    }
  }),
  getDb: () => dbMock
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});
