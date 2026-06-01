CREATE EXTENSION IF NOT EXISTS citext;

ALTER TABLE users ALTER COLUMN email TYPE CITEXT;

ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL;

CREATE TABLE user_identities (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_subject TEXT NULL,
    password_hash TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (provider, provider_subject),
    UNIQUE (provider, user_id)
);

INSERT INTO
    user_identities (
        id,
        user_id,
        provider,
        password_hash
    )
SELECT
    gen_random_uuid (),
    id,
    'local',
    password_hash
FROM users;

ALTER TABLE users DROP COLUMN password_hash;

CREATE TABLE sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    client_type TEXT NOT NULL,
    device_id TEXT NULL,
    refresh_token_hash BYTEA NOT NULL,
    refresh_token_expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);