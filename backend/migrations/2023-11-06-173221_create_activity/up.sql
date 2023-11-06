-- Your SQL goes here

CREATE TABLE
    Activity (
        id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        modified_at TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        is_deleted BOOLEAN NOT NULL,
        PRIMARY KEY (id)
    );