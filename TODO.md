# 🧪 Merpati CMS - Testing Implementation Roadmap

This document tracks the progress of implementing a comprehensive testing suite for Merpati CMS using Vitest.

## 🏗️ Phase 1: Infrastructure Setup
- [x] Install testing dependencies (`vitest`, `@vitejs/plugin-react`, `jsdom`, `dotenv`)
- [x] Create `vitest.config.ts`
- [x] Create `tests/setup.ts` for global mocks and configurations
- [x] Add `test` and `test:ui` scripts to `package.json`
- [x] Setup Drizzle ORM mocking strategy

## 🧠 Phase 2: Unit Testing (Logic & Utilities)
- [x] **Core Utils:** `lib/utils.ts` & `lib/utils/*.ts`
- [x] **Security:** `lib/rbac.ts` (Role Based Access Control)
- [x] **Auth Helpers:** `lib/api-auth.ts`
- [x] **Notifications:** `lib/notifications/telegram.ts` (API Mocking)
- [x] **Theme Logic:** `lib/themes.ts`

## 🏗️ Phase 3: Integration Testing (Actions & Queries)
- [x] **Queries:**
    - [x] `lib/queries/posts.ts`
    - [x] `lib/queries/menus.ts`
    - [x] `lib/queries/options.ts`
- [x] **Server Actions (Business Logic):**
    - [x] `lib/actions/posts.ts`
    - [x] `lib/actions/users.ts`
    - [x] `lib/actions/setup.ts`
    - [x] `lib/actions/media.ts`
    - [x] `lib/actions/menus.ts`
- [x] **API Routes:**
    - [x] `/api/check-init`
    - [x] `/api/posts`

## 🎨 Phase 4: Component & UI Testing
- [x] **Shared UI:** `components/ui/*.tsx`
- [x] **Admin Forms:** Post editor, User management
- [x] **Public Layouts:** Theme rendering logic

## 📈 Finalization
- [x] Achieve >80% code coverage on core logic (lib/ and app/api)
- [ ] Integrate tests into CI/CD (Optional/Future)
- [x] Documentation for writing new tests (See TDD.md)

## 🛠️ Phase 5: Closing Logic Gaps (Server Actions)
- [x] `lib/actions/options.ts`
- [x] `lib/actions/terms.ts`
- [x] `lib/actions/tokens.ts`
- [x] `lib/actions/backup.ts`
- [x] `lib/actions/cache.ts`

## 🌐 Phase 6: API & Integration Gaps
- [x] `/api/posts/[id]`
- [x] `/api/media`
- [x] `/api/cron/*` (Backup triggers)
- [x] `lib/queries/cache-timestamp.ts`
- [x] `lib/db-guard.ts`
- [x] `lib/get-base-url.ts`

## 🎯 Phase 7: Backend Core Logic to >90% Coverage
*Meningkatkan coverage file `lib/actions` dan `lib/queries` yang masih di bawah 90%.*
- [x] `lib/actions/users.ts` (Current: >98%)
- [x] `lib/actions/backup.ts` (Current: >95%)
- [x] `lib/queries/posts.ts` (Current: 100%)
- [x] `lib/actions/media.ts` (Current: 100%)
- [x] `lib/actions/terms.ts` (Current: 100%)
- [x] `lib/actions/menus.ts` (Current: 100%)
- [x] `lib/actions/posts.ts` (Current: >95%)
- [x] `lib/actions/options.ts` (Current: 100%)
- [x] `lib/actions/tokens.ts` (Current: 100%)

## 🖥️ Phase 8: UI & Components to >90% Coverage
*Meningkatkan coverage komponen antarmuka yang sangat banyak jumlahnya.*
- [x] `components/ui/*` (Targeting Radix UI wrappers - 10 components tested)
- [ ] `themes/default/components/*` (Archive component tested)
- [ ] `themes/news/components/*`
- [ ] `themes/portfolio/components/*`
