ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL;

INSERT INTO
    users (
        id,
        email,
        password_hash,
        created_at,
        updated_at
    )
SELECT
    id,
    email,
    (
        SELECT password_hash
        FROM user_identities
        WHERE
            user_identities.user_id = users.id
            AND provider = 'local'
        LIMIT 1
    ),
    created_at,
    updated_at
FROM users;

DROP TABLE user_identities;

ALTER TABLE users DROP COLUMN email_verified;

ALTER TABLE users ALTER COLUMN email TYPE TEXT;