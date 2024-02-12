-- Active: 1705966558620@@127.0.0.1@5432@splittery
CREATE TABLE "split" (
    "id" SERIAL, name TEXT NOT NULL, PRIMARY KEY ("id")
)

CREATE TABLE "user" (
    "id" SERIAL, "name" TEXT NOT NULL, "split_id" INTEGER NOT NULL, FOREIGN KEY ("split_id") REFERENCES "split" ("id"), PRIMARY KEY ("id")
)

CREATE TABLE "transaction" (
    "id" SERIAL, "name" TEXT NOT NULL, "split_id" INTEGER NOT NULL, "amount" INTEGER NOT NULL, "payer_id" INTEGER NOT NULL, FOREIGN KEY ("split_id") REFERENCES "split" ("id"), FOREIGN KEY ("payer_id") REFERENCES "user" ("id"), PRIMARY KEY ("id")
)