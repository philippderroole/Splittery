CREATE TABLE
    users (
        name VARCHAR NOT NULL,
        activity_id VARCHAR NOT NULL,
        PRIMARY KEY (name, activity_id)
    );

CREATE TABLE
    balances(
        user_name VARCHAR NOT NULL,
        activity_id VARCHAR NOT NULL,
        amount FLOAT8 NOT NULL,
        expense_id VARCHAR NOT NULL,
        is_selected BOOLEAN NOT NULL,
        share FLOAT8 NOT NULL,
        PRIMARY KEY(
            user_name,
            activity_id,
            expense_id
        )
    );

CREATE TABLE
    expenses (
        id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        amount FLOAT8 NOT NULL,
        user_name VARCHAR NOT NULL,
        activity_id VARCHAR NOT NULL,
        PRIMARY KEY (id)
    );

CREATE TABLE activities (id VARCHAR NOT NULL, PRIMARY KEY (id)) 