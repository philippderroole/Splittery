-- Your SQL goes here

CREATE TABLE
    Expense (
        id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        activity_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        modified_at TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        is_deleted BOOLEAN NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (activity_id) REFERENCES Activity(id)
    );