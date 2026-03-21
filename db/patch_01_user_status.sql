-- Run this patch on your Neon database SQL editor to support user suspension (Issue #2)

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "users" 
ADD COLUMN IF NOT EXISTS "status" "user_status" NOT NULL DEFAULT 'active';
