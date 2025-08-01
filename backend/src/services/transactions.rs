use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::{Transaction, TransactionDb},
    services,
};

pub async fn get_transactions_for_split(pool: &PgPool, split_id: Uuid) -> Result<Vec<Transaction>> {
    let transactions_db = sqlx::query_as!(
        TransactionDb,
        "
        SELECT id, public_id, name, amount, member_id, split_id, executed_at, created_at, updated_at
        FROM transactions
        WHERE split_id = $1
        ORDER BY created_at DESC
        ",
        split_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get transactions for split: {}", e))?;

    let mut transactions = Vec::new();

    for transaction_db in transactions_db {
        let entries = services::get_entries_for_transaction(pool, transaction_db.id).await?;

        let tags =
            services::transaction_tags::get_tags_for_transaction(pool, split_id, transaction_db.id)
                .await?;

        transactions.push(Transaction::from(transaction_db, tags, entries));
    }

    Ok(transactions)
}

#[derive(Debug)]
pub enum CreateTransactionError {
    TransactionMemberNotFound,
    UnexpectedError(anyhow::Error),
}

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
    tag_ids: Vec<Uuid>,
) -> Result<Transaction, CreateTransactionError> {
    if tag_ids.is_empty() {
        return Err(CreateTransactionError::UnexpectedError(anyhow!(
            "No tags provided for transaction"
        )));
    }

    let transaction_id = Uuid::new_v4();
    let transaction_db = sqlx::query_as!(
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
    });

    services::set_tags_for_transaction(pool, transaction_id, &tag_ids)
        .await
        .map_err(|e| {
            CreateTransactionError::UnexpectedError(anyhow!("Failed to add tags: {}", e))
        })?;

    let tags = services::get_tags_for_transaction(pool, split_id, transaction_id)
        .await
        .map_err(|e| {
            CreateTransactionError::UnexpectedError(anyhow!("Failed to get tags: {}", e))
        })?;

    Ok(Transaction::from(transaction_db?, tags, Vec::new()))
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
