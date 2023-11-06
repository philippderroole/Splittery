-- Your SQL goes here

CREATE TABLE
    UserActivity (
        user_id VARCHAR(255) NOT NULL,
        activity_id VARCHAR(255) NOT NULL,
        PRIMARY KEY (user_id, activity_id),
        FOREIGN KEY (user_id) REFERENCES SplitteryUser(id),
        FOREIGN KEY (activity_id) REFERENCES Activity(id)
    );