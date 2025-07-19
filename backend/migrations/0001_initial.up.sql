CREATE TABLE users (
    id UUID PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE splits (
    id UUID PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TYPE member_type AS ENUM ('registered', 'guest');

CREATE TABLE split_members (
    id UUID PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type member_type NOT NULL,
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(split_id, user_id),
    UNIQUE (split_id, name)
);

CREATE TABLE tags (
    id UUID PRIMARY KEY,
    public_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(9) NOT NULL, -- Hex color code, e.g. '#e9694dff'
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    is_custom BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_tag_name UNIQUE (name, split_id)
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES split_members(id) ON DELETE CASCADE,
    public_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL, -- Amount in cents
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(split_id, public_id)
);

CREATE TABlE member_tags (
    member_id UUID NOT NULL REFERENCES split_members(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (member_id, tag_id)
);

CREATE TABLE entries (
    id UUID PRIMARY KEY,
    public_id VARCHAR(255) NOT NULL,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    split_id UUID NOT NULL REFERENCES splits(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount BIGINT NOT NULL, -- Amount in cents
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE entry_tags (
    entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, tag_id)
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_transactions_split_id ON transactions(split_id);
CREATE INDEX idx_entries_transaction_id ON entries(transaction_id);

CREATE VIEW member_income_view AS
SELECT
    entry.split_id,
    mt.member_id,
    SUM(entry.amount / NULLIF(cnt.count, 0)) AS income
FROM entries entry
JOIN entry_tags et ON entry.id = et.entry_id
JOIN tags tag ON et.tag_id = tag.id
JOIN member_tags mt ON tag.id = mt.tag_id
JOIN (
    SELECT tag_id, COUNT(*) AS count
    FROM member_tags
    GROUP BY tag_id
) cnt ON cnt.tag_id = tag.id
GROUP BY entry.split_id, mt.member_id;

CREATE VIEW member_expenses_view AS
SELECT split_id, transaction.member_id, SUM(transaction.amount) AS expenses
FROM transactions transaction
GROUP BY transaction.split_id, transaction.member_id, transaction.member_id;

CREATE VIEW member_income_debug_view AS
SELECT
    split.name AS split_name,
    member.name AS member_name,
    COALESCE(income.income, 0) AS income
FROM split_members member
JOIN splits split ON member.split_id = split.id
LEFT JOIN member_income_view income ON income.member_id = member.id AND income.split_id = split.id
GROUP BY split.name, member.name, income.income;

CREATE VIEW member_expenses_debug_view AS
SELECT
    split.name AS split_name,
    member.name AS member_name,
    COALESCE(expenses.expenses, 0) AS expenses
FROM split_members member
JOIN splits split ON member.split_id = split.id
LEFT JOIN member_expenses_view expenses ON expenses.member_id = member.id AND expenses.split_id = split.id
GROUP BY split.name, member.name, expenses.expenses;