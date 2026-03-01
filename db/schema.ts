import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    boolean,
    uuid,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["user", "super_user"]);
export const postStatusEnum = pgEnum("post_status", ["draft", "published", "archived"]);
export const postTypeEnum = pgEnum("post_type", ["post", "page"]);
export const termTypeEnum = pgEnum("term_type", ["category", "tag"]);

// --- Auth.js Tables ---
export const users = pgTable("user", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: roleEnum("role").default("user").notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

export const pendingInvitations = pgTable("pending_invitation", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    role: roleEnum("role").default("user").notNull(),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
});

// --- CMS Tables ---
export const posts = pgTable("post", {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content"),
    excerpt: text("excerpt"),
    status: postStatusEnum("status").default("draft").notNull(),
    type: postTypeEnum("type").default("post").notNull(),
    coverImage: text("cover_image"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
});

export const terms = pgTable("term", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    type: termTypeEnum("type").notNull(),
    parentId: uuid("parent_id"), // Self-referencing foreign key will be handled at app level to avoid complex setup
});

export const termRelationships = pgTable("term_relationship", {
    postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    termId: uuid("term_id").notNull().references(() => terms.id, { onDelete: "cascade" }),
}, (t) => ({
    compoundKey: primaryKey({ columns: [t.postId, t.termId] }),
}));

export const media = pgTable("media", {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: text("filename").notNull(),
    url: text("url").notNull(),
    size: integer("size").notNull(), // in bytes
    mimeType: text("mime_type").notNull(),
    uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const settings = pgTable("setting", {
    key: text("key").primaryKey(),
    value: text("value"), // Stored as JSON string or plain text
});

// --- Relations ---
export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    media: many(media),
}));

export const mediaRelations = relations(media, ({ one }) => ({
    author: one(users, {
        fields: [media.uploadedBy],
        references: [users.id],
    })
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
    terms: many(termRelationships),
}));

export const termsRelations = relations(terms, ({ many }) => ({
    posts: many(termRelationships),
}));

export const termRelationshipsRelations = relations(termRelationships, ({ one }) => ({
    post: one(posts, {
        fields: [termRelationships.postId],
        references: [posts.id],
    }),
    term: one(terms, {
        fields: [termRelationships.termId],
        references: [terms.id],
    }),
}));
