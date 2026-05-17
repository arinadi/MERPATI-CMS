# Next.js Cache Revalidation Plan

## Context
Currently, the Merpati CMS utilizes `revalidatePath` in several Server Actions (e.g., after creating, updating, or deleting posts, options, or menus). While this works, it can be inefficient, especially when using `revalidatePath("/")`, as it forces a full re-render of routes rather than surgically purging specific cached data. 

The CMS already makes excellent use of `unstable_cache` with specific tags (`"posts"`, `"site-menus"`, `"site-options"`). The goal of this plan is to fully transition to **Tag-Based Revalidation** using `revalidateTag`.

## Objective
Replace overly broad `revalidatePath` calls with precise `revalidateTag` calls across all mutation Server Actions to maximize cache hit rates and reduce server load.

## Phase 1: Audit Current Revalidation Usage
Identify all files using `revalidatePath`.
*Files to check:*
- `lib/actions/posts.ts`
- `lib/actions/menus.ts`
- `lib/actions/options.ts`
- `lib/actions/terms.ts`
- `lib/actions/users.ts`

## Phase 2: Mapping Tags to Mutations
Ensure that every mutation correctly targets the tags associated with the affected data:
1. **Posts/Pages Mutations (`lib/actions/posts.ts`, `lib/actions/terms.ts`)**
   - *Current:* `revalidatePath("/admin/posts")`, `revalidatePath("/")`
   - *New:* `revalidateTag("posts")`, `revalidateTag("taxonomy-posts")`, `revalidateTag("archive-posts")`
   - *Note:* We need to ensure that `unstable_cache` implementations in `lib/queries/posts.ts` have comprehensive tags. Currently, they mostly share the `"posts"` tag, which is a good starting point.

2. **Menu Mutations (`lib/actions/menus.ts`)**
   - *Current:* `revalidatePath("/admin/menus")`
   - *New:* `revalidateTag("site-menus")`

3. **Options Mutations (`lib/actions/options.ts`)**
   - *Current:* `revalidatePath("/", "layout")`, `revalidateTag("site-options")`
   - *New:* Keep `revalidateTag("site-options")`. We may need to evaluate if `revalidatePath` is still strictly necessary for the root layout if the layout relies solely on cached options.

4. **User Mutations (`lib/actions/users.ts`)**
   - Users are mostly an admin concept. If user data is displayed on the frontend (e.g., Author profiles), we need a specific tag like `"users"` or `"authors"`.

## Phase 3: Implementation Strategy (The Tricky Part)
1. **Admin vs. Public Caching:** 
   - Admin routes (`/admin/*`) are typically dynamic. If they use `fetch` or cached queries, they will benefit from `revalidateTag`. 
   - Public routes rely heavily on `unstable_cache`. `revalidateTag` will accurately purge the data cache, meaning the next request will fetch fresh data, and subsequent ISR/SSG generations will reflect the new data.

2. **Execution:**
   - Go through each action file.
   - Replace `revalidatePath` with `revalidateTag(TAG_NAME)`.
   - **Crucial:** Test the frontend after each replacement. The "tricky" aspect is ensuring that removing a `revalidatePath` doesn't leave a stale static page if Next.js Router Cache isn't automatically invalidated by the tag purge.

## Phase 4: Verification
- Use Next.js build logs to ensure pages are correctly marked as static/ISR.
- Use a local production build (`npm run build && npm start`) to verify that mutating data in the admin panel correctly updates the public frontend without requiring a hard refresh or server restart.
