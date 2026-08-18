ALTER TABLE sessions
ALTER COLUMN refresh_token_expires_at
SET NOT NULL;

ALTER TABLE users DROP COLUMN is_anonymous;