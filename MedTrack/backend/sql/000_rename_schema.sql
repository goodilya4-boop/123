-- Rename the existing PostgreSQL schema from quoted "MedTrack" to lowercase medtrak.
-- Safe to run more than once: if medtrak already exists, nothing is changed.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_namespace
        WHERE nspname = 'MedTrack'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM pg_namespace
        WHERE nspname = 'medtrak'
    ) THEN
        EXECUTE 'ALTER SCHEMA "MedTrack" RENAME TO medtrak';
    END IF;
END
$$;
