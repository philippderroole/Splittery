-- This file should undo anything in `up.sql`

ALTER TABLE users DROP CONSTRAINT activities_users_fkey;

ALTER TABLE
    balances DROP CONSTRAINT balances_users_fkey,
    DROP CONSTRAINT balances_expenses_fkey,
    DROP CONSTRAINT balances_activities_fkey;

ALTER TABLE
    expenses DROP CONSTRAINT expenses_activities_fkey,
    DROP CONSTRAINT expenses_users_fkey;