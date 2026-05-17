# Test-Driven Development Guidelines

This document outlines the testing standards and workflows for Merpati CMS. We follow a pragmatic TDD approach to ensure every feature is verified, stable, and maintainable.

## The TDD Lifecycle

While the classic TDD flow is **Red -> Green -> Refactor**, in this project we follow a structured "Feature-to-Test" flow:

1.  **Define Requirement:** Understand the business logic or bug fix needed.
2.  **Implementation (The "Act"):** Write the code (Server Action, Utility, or Component).
3.  **Test Creation/Update (The "Validate"):** Immediately create or update the corresponding `.test.ts` file.
4.  **Verification:** Run `npm test` to ensure the new code works and no regressions were introduced.
5.  **Refactor:** Clean up the code knowing you have a safety net.

---

## Testing Standards

### 1. File Naming & Location
- Tests must mirror the source directory structure inside the `tests/` folder.
- **Unit Tests:** `tests/unit/lib/.../[filename].test.ts`
- **Integration Tests:** `tests/integration/.../[filename].test.ts`
- **Component Tests:** `tests/components/.../[filename].test.tsx`

### 2. Mocking Strategy
To keep tests fast and isolated, we **NEVER** use a real database or network in unit/integration tests.

- **Database (Drizzle):** Use the global `dbMock` from `@/tests/mocks/db`.
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
