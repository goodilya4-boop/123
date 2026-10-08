BEGIN;

ALTER TABLE "medtrak"."audit"
    ALTER COLUMN user_event SET NOT NULL,
    ALTER COLUMN time_end SET NOT NULL;

ALTER TABLE "medtrak"."access"
    ALTER COLUMN access SET NOT NULL;

CREATE INDEX IF NOT EXISTS audit_user_id_idx
    ON "medtrak"."audit" (user_id);

CREATE INDEX IF NOT EXISTS audit_time_end_idx
    ON "medtrak"."audit" (time_end);

CREATE INDEX IF NOT EXISTS access_user_id_idx
    ON "medtrak"."access" (user_id);

COMMIT;
