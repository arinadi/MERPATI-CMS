-- This is for manual initialization in Neon directly if Drizzle fails
-- To be executed in Neon Console
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('super_user', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
        CREATE TYPE post_status AS ENUM ('draft', 'published', 'trash');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_visibility') THEN
        CREATE TYPE post_visibility AS ENUM ('public', 'private');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    image TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    alt_text TEXT,
    uploaded_by_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    status post_status DEFAULT 'draft' NOT NULL,
    visibility post_visibility DEFAULT 'public' NOT NULL,
    featured_image_id INTEGER REFERENCES media(id),
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    is_indexable BOOLEAN DEFAULT true NOT NULL,
    custom_meta JSONB,
    author_id INTEGER NOT NULL REFERENCES users(id),
    published_by_id INTEGER REFERENCES users(id),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS term_taxonomy (
    id SERIAL PRIMARY KEY,
    taxonomy TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    parent_id INTEGER
);

CREATE TABLE IF NOT EXISTS term_relationships (
    object_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    term_taxonomy_id INTEGER NOT NULL REFERENCES term_taxonomy(id) ON DELETE CASCADE,
    PRIMARY KEY(object_id, term_taxonomy_id)
);

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT
);
