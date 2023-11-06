CREATE TABLE
    users (
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        deleted_at TIMESTAMPTZ,
        id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE
    balances(
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        deleted_at TIMESTAMPTZ,
        user_id VARCHAR NOT NULL,
        expense_id VARCHAR NOT NULL,
        amount FLOAT8 NOT NULL,
        is_selected BOOLEAN NOT NULL,
        share FLOAT8 NOT NULL,
        PRIMARY KEY(user_id, expense_id)
    );

CREATE TABLE
    expenses (
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        deleted_at TIMESTAMPTZ,
        id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        amount FLOAT8 NOT NULL,
        user_id VARCHAR NOT NULL,
        activity_id VARCHAR NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE
    activities (
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        deleted_at TIMESTAMPTZ,
        id VARCHAR NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE
    users_activities (
        user_id VARCHAR NOT NULL,
        activity_id VARCHAR NOT NULL,
        PRIMARY KEY (user_id, activity_id)
    );