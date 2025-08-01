CREATE TABLE transaction_tags (
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);
INSERT INTO transaction_tags (transaction_id, tag_id)
SELECT transaction.id, tag.id
FROM transactions transaction
JOIN splits split ON split.id = transaction.split_id
JOIN tags tag ON tag.split_id = split.id
WHERE tag."type" = 'alltag'