import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
    primaryKey,
    type AnyPgColumn,
} from 'drizzle-orm/pg-core';

// ─── Enums ──────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['super_user', 'user']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published']);
export const postTypeEnum = pgEnum('post_type', ['post', 'page']);
export const taxonomyEnum = pgEnum('taxonomy_type', ['category', 'tag']);
export const menuItemTypeEnum = pgEnum('menu_item_type', ['custom', 'post', 'page', 'category']);
export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'expired']);

// ─── Users (Auth.js compatible) ─────────────────────────────────────────────

export const users = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name'),
    email: text('email').unique().notNull(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    image: text('image'),
    role: userRoleEnum('role').default('user').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Accounts (Auth.js compatible) ──────────────────────────────────────────

export const accounts = pgTable('accounts', {
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
}, (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
]);

// ─── Invitations ────────────────────────────────────────────────────────────

export const invitations = pgTable('invitations', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull(),
    token: text('token').notNull().unique(),
    status: invitationStatusEnum('status').default('pending').notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Options (Key-Value Settings) ───────────────────────────────────────────

export const options = pgTable('options', {
    key: text('key').primaryKey(),
    value: text('value').notNull(),
    autoload: boolean('autoload').default(true).notNull(),
});

// ─── Posts ───────────────────────────────────────────────────────────────────

export const posts = pgTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content'),
    excerpt: text('excerpt'),
    status: postStatusEnum('status').default('draft').notNull(),
    type: postTypeEnum('type').default('post').notNull(),
    authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
    featuredImage: text('featured_image'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Post Relationships (Related Posts) ─────────────────────────────────────

export const postRelationships = pgTable('post_relationships', {
    postId: text('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    relatedPostId: text('related_post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.postId, table.relatedPostId] }),
]);

// ─── Terms (Categories & Tags) ─────────────────────────────────────────────

export const terms = pgTable('terms', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    taxonomy: taxonomyEnum('taxonomy').notNull(),
    parentId: text('parent_id').references((): AnyPgColumn => terms.id, { onDelete: 'set null' }),
    description: text('description'),
});

// ─── Term Relationships (Post ↔ Term) ──────────────────────────────────────

export const termRelationships = pgTable('term_relationships', {
    objectId: text('object_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
    termId: text('term_id').notNull().references(() => terms.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.objectId, table.termId] }),
]);

// ─── Media ──────────────────────────────────────────────────────────────────

export const media = pgTable('media', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    url: text('url').notNull(),
    filename: text('filename').notNull(),
    mimeType: text('mime_type'),
    size: integer('size'),
    altText: text('alt_text'),
    authorId: text('author_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Menus ──────────────────────────────────────────────────────────────────

export const menus = pgTable('menus', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    location: text('location'),
});

// ─── Menu Items ─────────────────────────────────────────────────────────────

export const menuItems = pgTable('menu_items', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    menuId: text('menu_id').notNull().references(() => menus.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    url: text('url'),
    objectId: text('object_id'),
    type: menuItemTypeEnum('type').default('custom').notNull(),
    parentId: text('parent_id').references((): AnyPgColumn => menuItems.id, { onDelete: 'set null' }),
    sortOrder: integer('sort_order').default(0).notNull(),
});
