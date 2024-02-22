-- Active: 1705966558620@@127.0.0.1@5432@splittery
CREATE TABLE
    "split" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        PRIMARY KEY ("id")
    );

CREATE TRIGGER trigger_genid BEFORE INSERT ON split FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

CREATE TABLE
    "user" (
        "id" SERIAL,
        "name" TEXT NOT NULL,
        "split_id" TEXT NOT NULL,
        FOREIGN KEY ("split_id") REFERENCES "split" ("id"),
        PRIMARY KEY ("id")
    );

CREATE TABLE
    "transaction" (
        "id" SERIAL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "split_id" TEXT NOT NULL,
        "user_id" INTEGER NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        FOREIGN KEY ("split_id") REFERENCES "split" ("id"),
        FOREIGN KEY ("user_id") REFERENCES "user" ("id"),
        PRIMARY KEY ("id")
    );