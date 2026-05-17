# Shared Component Architecture Audit

## Current State Observation
During the process of writing tests, I observed the structure of the `components/` and `themes/` directories. While there is a root `components/` directory (containing UI components and admin components), there is significant duplication of theme-related components across the different themes (`default`, `news`, `portfolio`).

### Duplicated Theme Components
The following components are repeated across multiple themes:
1. `share-buttons.tsx` (Exists in `components/`, `themes/default/components/`, `themes/news/components/`, `themes/portfolio/components/`)
2. `featured-media.tsx` (Exists in `default`, `news`, `portfolio`)
3. `post-card.tsx` (Exists in `default`, `portfolio`)
4. `archive.tsx` (Exists in all themes)
5. `home.tsx` (Exists in all themes)
6. `not-found.tsx` (Exists in all themes)
7. `single-post.tsx` & `single-page.tsx` (Exists in all themes)
8. `layout.tsx` (Exists in all themes)

## Issues Identified
- **DRY (Don't Repeat Yourself) Violation:** Bug fixes or feature additions (like adding a new social share button) require updating 4 different `share-buttons.tsx` files.
- **Testing Overhead:** Testing the logic of a `PostCard` or `ShareButtons` means we theoretically have to test them multiple times for each theme to ensure >90% coverage.
- **Maintenance Burden:** Creating a new theme requires copying all these boilerplate components.

## Recommended Refactoring Strategy

### 1. Extract Logic into Hooks or Shared Utilities
Extract data-fetching, logic, and state management out of the presentation components. 
For example, the logic to generate social share URLs is already nicely extracted to `lib/utils/social.ts`.

### 2. Create a "Base" Theme Component Library
Create a new directory: `components/theme-base/` (or similar).
Move the purely functional and structurally identical components here:
- `components/theme-base/share-buttons.tsx`
- `components/theme-base/featured-media.tsx`
- `components/theme-base/post-card-base.tsx`

### 3. Theme-Specific Styling (Composition over Inheritance)
Themes should ideally just import the base components and wrap them in theme-specific Tailwind classes or slightly different grid layouts.
If a theme needs a drastically different `PostCard`, *only then* should it create its own `themes/my-theme/components/post-card.tsx`. Otherwise, it should import from the base library.

### 4. Route Handling (`home.tsx`, `archive.tsx`, `single-post.tsx`)
These files in the themes act as Next.js route handlers/templates. It is acceptable for themes to have their own layout structures here, but the *inner content* (like mapping over posts to render cards) should utilize the shared `post-card` component.

## Conclusion
For future work, centralizing `share-buttons`, `featured-media`, and standardizing `post-card` into a shared component directory will improve the maintainability and testability of Merpati CMS.
