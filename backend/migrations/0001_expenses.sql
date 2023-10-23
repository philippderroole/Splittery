create table
    expenses (
        name varchar not null,
        amount integer not null,
        description varchar not null
    );

CREATE UNIQUE INDEX name ON expenses (name);