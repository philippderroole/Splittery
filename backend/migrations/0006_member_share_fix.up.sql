DROP VIEW member_shares;

CREATE VIEW member_shares AS
SELECT
    member.id AS member_id,
    COALESCE(transaction_totals.total_transaction_share, 0) + 
    COALESCE(entry_totals.total_entry_share, 0) AS total_share
FROM split_members AS member
LEFT JOIN (
    SELECT 
        member_id,
        SUM(share) AS total_transaction_share
    FROM member_share_transaction_view
    GROUP BY member_id
) AS transaction_totals ON member.id = transaction_totals.member_id
LEFT JOIN (
    SELECT 
        member_id,
        SUM(share) AS total_entry_share
    FROM member_share_entry_view
    GROUP BY member_id
) AS entry_totals ON member.id = entry_totals.member_id