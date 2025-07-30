use std::collections::HashMap;

use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{Entry, Tag, TagType, Transaction, TransactionDb};

pub async fn get_all_transactions(pool: &PgPool, split_id: Uuid) -> Result<Vec<Transaction>> {
    let rows = sqlx::query!(
        r#"
        SELECT
            t.id as transaction_id, t.public_id as transaction_public_id, 
            t.name as transaction_name, t.amount as transaction_amount,
            t.member_id as transaction_member_id, t.public_id as public_member_id, t.executed_at as transaction_executed_at,
            t.created_at as transaction_created_at, t.updated_at as transaction_updated_at,
            e.id AS "entry_id?", e.public_id as "entry_public_id?", 
            e.name AS "entry_name?", e.amount AS "entry_amount?",
            e.created_at as "entry_created_at?", e.updated_at as "entry_updated_at?",
            tag.id AS "tag_id?", tag.name AS "tag_name?", tag.color AS "tag_color?",
            tag.public_id as "tag_public_id?", tag.type as "tag_type?: TagType",
            tag.created_at as "tag_created_at?", tag.updated_at as "tag_updated_at?"
        FROM transactions t
        LEFT JOIN entries e ON t.id = e.transaction_id
        LEFT JOIN entry_tags et ON e.id = et.entry_id
        LEFT JOIN tags tag ON et.tag_id = tag.id AND tag.split_id = $1
        WHERE t.split_id = $1
        ORDER BY t.created_at DESC, t.id, e.id, tag.name
        "#,
        split_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get transactions with entries and tags: {}", e))?;

    let mut transactions = Vec::new();
    let mut entries_map = HashMap::new();
    let mut tags_map = HashMap::new();

    for row in rows {
        let transaction_id = row.transaction_id;

        let transaction = Transaction {
            id: transaction_id,
            public_id: row.transaction_public_id,
            name: row.transaction_name,
            amount: row.transaction_amount,
            split_id,
            member_id: row.transaction_member_id,
            executed_at: row.transaction_executed_at,
            created_at: row.transaction_created_at,
            updated_at: row.transaction_updated_at,
            entries: Vec::new(), // Will be filled later
        };

        transactions.push(transaction);

        if let (
            Some(entry_id),
            Some(entry_public_id),
            Some(entry_name),
            Some(entry_amount),
            Some(entry_created_at),
            Some(entry_updated_at),
        ) = (
            row.entry_id,
            row.entry_public_id,
            row.entry_name,
            row.entry_amount,
            row.entry_created_at,
            row.entry_updated_at,
        ) {
            let entry = Entry {
                id: entry_id,
                public_id: entry_public_id,
                name: entry_name,
                amount: entry_amount,
                transaction_id,
                created_at: entry_created_at,
                updated_at: entry_updated_at,
                tags: Vec::new(), // Will be filled later
            };

            entries_map
                .entry(transaction_id)
                .or_insert_with(Vec::new)
                .push(entry);

            if let (
                Some(tag_id),
                Some(tag_name),
                Some(tag_color),
                Some(tag_public_id),
                Some(tag_is_custom),
                Some(tag_created_at),
                Some(tag_updated_at),
            ) = (
                row.tag_id,
                row.tag_name,
                row.tag_color,
                row.tag_public_id,
                row.tag_type,
                row.tag_created_at,
                row.tag_updated_at,
            ) {
                let tag = Tag {
                    id: tag_id,
                    name: tag_name,
                    color: tag_color,
                    public_id: tag_public_id,
                    r#type: tag_is_custom,
                    split_id,
                    created_at: tag_created_at,
                    updated_at: tag_updated_at,
                };

                tags_map.entry(entry_id).or_insert_with(Vec::new).push(tag);
            }
        }
    }

    for transaction in &mut transactions {
        if let Some(entries) = entries_map.get(&transaction.id) {
            transaction.entries = entries.clone();
        }

        for entry in &mut transaction.entries {
            if let Some(tags) = tags_map.get(&entry.id) {
                entry.tags = tags.clone();
            }
        }
    }

    Ok(transactions)
}

#[derive(Debug)]
pub enum CreateTransactionError {
    TransactionMemberNotFound,
    UnexpectedError(anyhow::Error),
}

impl std::error::Error for CreateTransactionError {}

impl std::fmt::Display for CreateTransactionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CreateTransactionError::TransactionMemberNotFound => {
                write!(f, "Transaction member not found")
            }
            CreateTransactionError::UnexpectedError(error) => error.fmt(f),
        }
    }
}

pub async fn create_transaction(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
    name: String,
    amount: i64,
) -> Result<Transaction, CreateTransactionError> {
    let transaction_id = Uuid::new_v4();
    sqlx::query_as!(
        TransactionDb,
        "
        INSERT INTO transactions (id, public_id, name, amount, split_id, member_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, public_id, amount, split_id, member_id, executed_at, created_at, updated_at
        ",
        transaction_id,
        transaction_id.to_string(),
        name,
        amount,
        split_id,
        member_id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::Database(err) if err.constraint() == Some("transactions_member_id_fkey") => {
            CreateTransactionError::TransactionMemberNotFound
        }
        sqlx::Error::Database(err) if err.constraint().is_some() => {
            CreateTransactionError::UnexpectedError(anyhow!("{}", err.constraint().unwrap()))
        }
        e => {
            CreateTransactionError::UnexpectedError(anyhow!("Failed to create transaction: {}", e))
        }
    })
    .map(|transaction| Transaction::from(transaction, Vec::new()))
}

pub async fn delete_transaction(
    pool: &PgPool,
    split_id: Uuid,
    transaction_id: Uuid,
) -> Result<(), anyhow::Error> {
    sqlx::query!(
        "DELETE FROM entry_tags WHERE entry_id IN (SELECT id FROM entries WHERE split_id = $1 AND transaction_id = $2)",
        split_id,
        transaction_id
    )
    .execute(pool)
    .await
    .map_err(|e| anyhow!("Failed to delete entry tags: {}", e))?;

    sqlx::query!(
        "DELETE FROM entries WHERE split_id = $1 AND transaction_id = $2",
        split_id,
        transaction_id
    )
    .execute(pool)
    .await
    .map_err(|e| anyhow!("Failed to delete entries: {}", e))?;

    sqlx::query!(
        "DELETE FROM transactions WHERE split_id = $1 AND id = $2",
        split_id,
        transaction_id
    )
    .execute(pool)
    .await
    .map_err(|e| anyhow!("Failed to delete transaction: {}", e))?;

    Ok(())
}
