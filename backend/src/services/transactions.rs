use anyhow::{anyhow, Result};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::Transaction;

pub async fn get_all_transactions(pool: &PgPool, split_id: Uuid) -> Result<Vec<Transaction>> {
    sqlx::query_as!(
        Transaction,
        "
        SELECT id, name, public_id, amount, split_id, created_at, updated_at
        FROM transactions
        WHERE split_id = $1
        ",
        split_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get transactions: {}", e))
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
        Transaction,
        "
        INSERT INTO transactions (id, public_id, name, amount, split_id, member_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, public_id, amount, split_id, created_at, updated_at
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
            CreateTransactionError::UnexpectedError(anyhow!(format!(
                "{}",
                err.constraint().unwrap()
            )))
        }
        e => {
            CreateTransactionError::UnexpectedError(anyhow!("Failed to create transaction: {}", e))
        }
    })
}
