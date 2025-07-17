use anyhow::{anyhow, Result};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::TransactionEntry;

pub async fn get_all_entries(pool: &PgPool, transaction_id: Uuid) -> Result<Vec<TransactionEntry>> {
    let query_result = sqlx::query_as!(
        TransactionEntry,
        "
        SELECT id, name, amount, public_id, transaction_id, created_at, updated_at
        FROM entries
        WHERE transaction_id = $1
        ",
        transaction_id
    )
    .fetch_all(pool)
    .await;

    match query_result {
        Ok(members) => Ok(members),
        Err(e) => Err(anyhow!("Failed to get members: {}", e)),
    }
}

pub async fn create_entry(
    pool: &PgPool,
    split_id: Uuid,
    transaction_id: Uuid,
    name: String,
    amount: i64,
) -> Result<TransactionEntry> {
    let id = Uuid::new_v4();
    let query_result = sqlx::query_as!(
        TransactionEntry,
        "
        INSERT INTO entries (id, name, amount, public_id, transaction_id, split_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, amount, public_id, transaction_id, created_at, updated_at
        ",
        id,
        name,
        amount,
        id.to_string(),
        transaction_id,
        split_id
    )
    .fetch_one(pool)
    .await;

    match query_result {
        Ok(entry) => Ok(entry),
        Err(e) => Err(anyhow!("Failed to create entry: {}", e)),
    }
}

pub async fn delete_entry(pool: &PgPool, item_id: Uuid) -> Result<()> {
    let query_result = sqlx::query!(
        "
        DELETE FROM entries
        WHERE id = $1
        ",
        item_id
    )
    .execute(pool)
    .await;

    match query_result {
        Ok(_) => Ok(()),
        Err(e) => Err(anyhow!("Failed to delete entry: {}", e)),
    }
}
