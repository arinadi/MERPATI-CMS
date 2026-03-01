import { pgTable, serial, text, timestamp, boolean, pgEnum, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['super_user', 'user']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'trash']);
export const visibilityEnum = pgEnum('post_visibility', ['public', 'private']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    image: text('image'),
    role: userRoleEnum('role').default('user').notNull(),
    active: boolean('active').default(true).notNull(),
    bio: text('bio'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    content: text('content'),
    excerpt: text('excerpt'),
    status: postStatusEnum('status').default('draft').notNull(),
    visibility: visibilityEnum('visibility').default('public').notNull(),
    featuredImageId: integer('featured_image_id'),
    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    canonicalUrl: text('canonical_url'),
    isIndexable: boolean('is_indexable').default(true).notNull(),
    customMeta: jsonb('custom_meta'),
    authorId: integer('author_id').notNull().references(() => users.id),
    publishedById: integer('published_by_id').references(() => users.id),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const media = pgTable('media', {
    id: serial('id').primaryKey(),
    filename: text('filename').notNull(),
    url: text('url').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    altText: text('alt_text'),
    uploadedById: integer('uploaded_by_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const termTaxonomy = pgTable('term_taxonomy', {
    id: serial('id').primaryKey(),
    taxonomy: text('taxonomy').notNull(), // 'category' | 'tag'
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    parentId: integer('parent_id'),
});

export const termRelationships = pgTable('term_relationships', {
    objectId: integer('object_id').notNull().references(() => posts.id),
    termTaxonomyId: integer('term_taxonomy_id').notNull().references(() => termTaxonomy.id),
});

export const settings = pgTable('settings', {
    id: serial('id').primaryKey(),
    key: text('key').unique().notNull(),
    value: text('value'),
});

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id], relationName: 'author' }),
    publishedBy: one(users, { fields: [posts.publishedById], references: [users.id], relationName: 'publisher' }),
    featuredImage: one(media, { fields: [posts.featuredImageId], references: [media.id] }),
    terms: many(termRelationships),
}));

export const termRelationshipsRelations = relations(termRelationships, ({ one }) => ({
    post: one(posts, { fields: [termRelationships.objectId], references: [posts.id] }),
    term: one(termTaxonomy, { fields: [termRelationships.termTaxonomyId], references: [termTaxonomy.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts, { relationName: 'author' }),
    publishedPosts: many(posts, { relationName: 'publisher' }),
    uploadedMedia: many(media),
}));
