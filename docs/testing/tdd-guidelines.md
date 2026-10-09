# Test-Driven Development Guidelines

This document outlines the testing standards and workflows for Merpati CMS. We follow a pragmatic TDD approach to ensure every feature is verified, stable, and maintainable.

## The TDD Lifecycle

Tests come first. A test that was written after the code only describes the code, so it cannot catch a wrong design or a wrong query.

1.  **Define Requirement:** Write the behavior in the module doc (`docs/modules/`) first.
2.  **Red:** Write one test from that doc and run it. It must fail because the feature is missing (not because of a typo or a bad import). A test that passes on the first run proves nothing.
3.  **Green:** Write the smallest code that makes the test pass.
4.  **Refactor:** Clean up while all tests stay green. Do not edit the tests to make them pass.

Exception: tests added for behavior that already exists cannot be Red. Prove they can fail by breaking the code on purpose (in a scratch copy) and check that the test goes red.

---

## Testing Standards

### 1. File Naming & Location
- Tests must mirror the source directory structure inside the `tests/` folder.
- **Unit Tests:** `tests/unit/lib/.../[filename].test.ts`
- **Integration Tests:** `tests/integration/.../[filename].test.ts`
- **Component Tests:** `tests/components/.../[filename].test.tsx`

### 2. Mocking Strategy
Mock only what we do not own: the network, the clock, auth, and external services. Query logic (filters, sorting, pagination, deletes) must be tested against a real Postgres (PGlite, in memory), because a mocked `db` answers the same whatever the SQL is. Never use the production database or a real network in tests.

- **Database (Drizzle):** Existing tests use the global `dbMock` from `@/tests/mocks/db`. It only checks that a call happened, not that the query is right, so do not use it for new query-logic tests.
    ```typescript
    import { dbMock } from '@/tests/mocks/db';
    dbMock._setResolvedValue([{ id: 1, title: 'Mocked Post' }]);
    ```
- **Authentication:** Mock `auth` from `@/auth`.
    ```typescript
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } });
    ```
- **Next.js Features:** `revalidatePath`, `unstable_cache`, and `useRouter` are auto-mocked in `tests/setup.ts`.

### 3. What to Test?
- **Logic Branches:** Ensure `if/else`, `try/catch`, and edge cases (empty results, null values) are covered.
- **Security:** Always test that unauthorized users are rejected.
- **Validation:** Test that invalid input (via Zod or manual checks) returns the correct error.

---

## Commands

| Command | Purpose |
| :--- | :--- |
| `npm test` | Run all tests in watch mode. |
| `npm run test:coverage` | Generate coverage report (Target: >80%). |
| `npm run test:ui` | Open Vitest UI in the browser. |
| `npm test -- [path]` | Run a specific test file. |

---

## Best Practices
- **Clean Tests:** Use `beforeEach` to clear mocks via `vi.clearAllMocks()`.
- **Descriptive Names:** Test names should describe the *behavior*, not just the function name (e.g., `it('should return error if slug is taken')`).
- **One Assertion per Test (Ideally):** Keep tests focused on a single outcome for easier debugging.
- **Mocking External APIs:** Always mock fetch calls for external services like Telegram or Cloud Storage.
