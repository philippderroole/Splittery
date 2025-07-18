use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{Entry, EntryDb};

pub async fn create_entry(
    pool: &PgPool,
    split_id: Uuid,
    transaction_id: Uuid,
    name: String,
    amount: i64,
) -> Result<Entry> {
    let id = Uuid::new_v4();
    let entry = sqlx::query_as!(
        EntryDb,
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
    .await
    .map_err(|e| anyhow!("Failed to create entry: {}", e))?;

    Ok(Entry::from(entry, Vec::new()))
}

pub async fn get_all_entries_for_transaction(
    pool: &PgPool,
    transaction_id: Uuid,
) -> Result<Vec<Entry>> {
    sqlx::query_as!(
        EntryDb,
        "
        SELECT id, public_id, name, amount, transaction_id, created_at, updated_at
        FROM entries
        WHERE transaction_id = $1
        ",
        transaction_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get entries: {}", e))
    .map(|entries| {
        entries
            .into_iter()
            .map(|entry| Entry::from(entry, Vec::new()))
            .collect::<Vec<Entry>>()
    })
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
