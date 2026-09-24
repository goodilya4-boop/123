BEGIN;

-- Existing data must be normalized before adding the unique constraint.
UPDATE "MedTrack"."users"
SET email = LOWER(BTRIM(email))
WHERE email IS NOT NULL;

-- Public registration no longer accepts a role. Existing NULL roles receive
-- the least-privileged default role before the NOT NULL constraint is added.
UPDATE "MedTrack"."users"
SET role = 'медсестра'
WHERE role IS NULL;

-- bcrypt hashes are longer than VARCHAR(50).
ALTER TABLE "MedTrack"."users"
    ALTER COLUMN password TYPE VARCHAR(255),
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN role SET NOT NULL;

-- Fail explicitly instead of silently choosing a duplicate account.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "MedTrack"."users"
        GROUP BY email
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Cannot add unique email constraint: duplicate emails exist in MedTrack.users';
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
    ON "MedTrack"."users" (email);

COMMIT;