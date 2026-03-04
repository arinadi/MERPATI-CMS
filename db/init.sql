-- MERPATI-CMS: Database Initialization Script
-- This file is executed at runtime during first setup to create all tables.
-- DO NOT use drizzle-kit migrations. This is the sole DDL source.

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_user', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE post_type AS ENUM ('post', 'page');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE taxonomy_type AS ENUM ('category', 'tag');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE menu_item_type AS ENUM ('custom', 'post', 'page', 'category');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT NOT NULL UNIQUE,
    email_verified TIMESTAMP,
    image TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Accounts (Auth.js OAuth)
CREATE TABLE IF NOT EXISTS accounts (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    PRIMARY KEY (provider, provider_account_id)
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status invitation_status NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Options (Key-Value Settings)
CREATE TABLE IF NOT EXISTS options (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    autoload BOOLEAN NOT NULL DEFAULT TRUE
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    status post_status NOT NULL DEFAULT 'draft',
    type post_type NOT NULL DEFAULT 'post',
    author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    featured_image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Post Relationships (Related Posts)
CREATE TABLE IF NOT EXISTS post_relationships (
    post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    related_post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, related_post_id)
);

-- Terms (Categories & Tags)
CREATE TABLE IF NOT EXISTS terms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    taxonomy taxonomy_type NOT NULL,
    parent_id TEXT REFERENCES terms(id) ON DELETE SET NULL,
    description TEXT
);

-- Term Relationships (Post ↔ Term)
CREATE TABLE IF NOT EXISTS term_relationships (
    object_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    term_id TEXT NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
    PRIMARY KEY (object_id, term_id)
);

-- Media
CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER,
    alt_text TEXT,
    author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Menus
CREATE TABLE IF NOT EXISTS menus (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    location TEXT
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    menu_id TEXT NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    object_id TEXT,
    type menu_item_type NOT NULL DEFAULT 'custom',
    parent_id TEXT REFERENCES menu_items(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);
