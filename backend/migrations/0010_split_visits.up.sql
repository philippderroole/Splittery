CREATE TABLE split_visits (
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    split_id UUID NOT NULL REFERENCES splits (id) ON DELETE CASCADE,
    first_visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    visit_count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (user_id, split_id)
);

CREATE INDEX idx_split_visits_split_id_last_visited_at ON split_visits (
    split_id,
    last_visited_at DESC
);