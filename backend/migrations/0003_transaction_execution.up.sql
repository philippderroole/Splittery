ALTER TABLE transactions
ADD COLUMN executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW();