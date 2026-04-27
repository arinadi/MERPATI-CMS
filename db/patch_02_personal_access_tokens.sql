-- Patch: Add Personal Access Tokens table
-- Date: 2026-04-27

CREATE TABLE IF NOT EXISTS "personal_access_tokens" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" text NOT NULL,
    "token" text NOT NULL UNIQUE,
    "last_used_at" timestamp,
    "expires_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Index for faster token lookups
CREATE INDEX IF NOT EXISTS "idx_pat_token" ON "personal_access_tokens" ("token");
CREATE INDEX IF NOT EXISTS "idx_pat_user_id" ON "personal_access_tokens" ("user_id");
