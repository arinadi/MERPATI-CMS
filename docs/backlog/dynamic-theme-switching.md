# Research: Dynamic Theme Switching

- **Status**: Backlog / Postponed
- **Requested by**: User
- **Last Updated**: 2026-04-10

## Overview
Currently, Merpati CMS uses a **Static build-time resolution** for themes. The active theme is hardcoded in the `.env` file and resolved in `lib/themes.ts`. While extremely performant, it requires a redeploy/restart to change the "skin" of the site.

This document explores the possibility of moving this selection to the Database to allow Admin-level theme switching.

## Technical Comparison

| Feature | Static (.env) | Dynamic (Database) |
|---|---|---|
| **Theme Selection** | Redefine `.env` + Restart | Admin UI Dropdown |
| **Performance** | Zero overhead | ~1ms (Data Cache) |
| **Caching** | Full Route Cache (Native) | Full Route Cache (with ISR revalidation) |
| **Execution Memory** | loads 1 theme into RAM | loads 1 theme into RAM (with `await import`) |
| **Server Bundle** | Only active theme | All themes bundled (Disk space only) |

## Proposed Strategy: Dynamic Hybrid Import

To implement this without sacrificing speed, we should use the **Dynamic Import** pattern combined with Merpati's existing caching engine.

### 1. The Resolver
Instead of a static map export, we use an async resolver:
```tsx
// lib/theme-resolver.ts
export async function getActiveTheme(): Promise<ThemeExports> {
    const slug = await getCachedOption("active_theme") || "default";
    const theme = await import(`@/themes/${slug}/index.tsx`);
    return theme.default || theme;
} 
```

### 2. Cache Invalidation
When the `active_theme` is changed in the database, we must trigger:
- `revalidateTag("site-options")`: Refreshes the theme slug.
- `revalidatePath("/", "layout")`: Purges all cached HTML to re-render with the new theme components.

## Drawbacks & Considerations
- **Disk Bloat**: All theme code must exist in the production environment.
- **Complexity**: Shared components (like `ShareButtons`) must be moved to a global `@/components` folder to avoid cross-theme dependency cycles.
- **Hydration Risk**: Switching themes dynamically must be handled carefully to avoid SSR vs CSR mismatch if some state depends on theme variables.

## Conclusion
This feature is highly recommended for **SaaS/Multi-tenant** versions of Merpati CMS. For single-site deployments, the current `.env` method remains the most optimized for performance and type safety.
