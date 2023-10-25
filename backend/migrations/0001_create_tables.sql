CREATE TABLE
    users (
        name VARCHAR NOT NULL,
        activity VARCHAR NOT NULL,
        PRIMARY KEY (name, activity)
    );

CREATE TABLE
    balances(
        id INT NOT NULL,
        user_name VARCHAR NOT NULL,
        activity VARCHAR NOT NULL,
        amount INT NOT NULL,
        expense VARCHAR NOT NULL,
        PRIMARY KEY(id)
    );

CREATE TABLE
    expenses (
        name VARCHAR NOT NULL,
        amount INT NOT NULL,
        description VARCHAR NOT NULL,
        activity VARCHAR NOT NULL,
        PRIMARY KEY (name, activity)
    );

CREATE TABLE activities (id VARCHAR NOT NULL, PRIMARY KEY (id)) 