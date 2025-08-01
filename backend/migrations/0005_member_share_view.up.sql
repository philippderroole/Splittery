CREATE VIEW paying_members_transaction AS
SELECT DISTINCT 
    member.id AS member_id,
    member.name AS member_name,
    tt.transaction_id
FROM split_members as member
JOIN member_tags as mt ON member.id = mt.member_id
JOIN transaction_tags as tt ON mt.tag_id = tt.tag_id;

CREATE VIEW paying_members_entry AS
SELECT DISTINCT 
    member.id AS member_id,
    member.name AS member_name,
    et.entry_id
FROM split_members as member
JOIN member_tags as mt ON member.id = mt.member_id
JOIN entry_tags as et ON mt.tag_id = et.tag_id;

CREATE VIEW member_share_transaction_view AS
SELECT
    transaction.id AS transaction_id,
    (transaction.amount - COALESCE(entry_totals.total_entries, 0)) AS transaction_remaining_amount,
    paying_members_transaction.member_id,
    ((transaction.amount - COALESCE(entry_totals.total_entries, 0)) / COUNT(*) OVER (PARTITION BY transaction.id)) AS share
FROM transactions as transaction
JOIN paying_members_transaction ON paying_members_transaction.transaction_id = transaction.id
LEFT JOIN (
    SELECT 
        transaction_id,
        SUM(amount) AS total_entries
    FROM entries
    GROUP BY transaction_id
) AS entry_totals ON transaction.id = entry_totals.transaction_id;

CREATE VIEW member_share_entry_view AS
SELECT 
    entry.id AS entry_id,
    entry.amount AS entry_amount,
    paying_members_entry.member_id,
    (entry.amount / COUNT(*) OVER (PARTITION BY entry.id)) AS share
FROM entries as entry
JOIN paying_members_entry ON paying_members_entry.entry_id = entry.id;

CREATE VIEW member_shares AS
SELECT
    member.id AS member_id,
    SUM(COALESCE(member_share_transaction_view.share, 0)) + SUM(COALESCE(member_share_entry_view.share, 0)) AS total_share
FROM split_members AS member
LEFT JOIN member_share_transaction_view ON member.id = member_share_transaction_view.member_id
LEFT JOIN member_share_entry_view ON member.id = member_share_entry_view.member_id
GROUP BY member.id;