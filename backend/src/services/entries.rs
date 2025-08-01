use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::{Entry, EntryDb},
    services,
};

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

    let tags = services::get_tags_for_entry(pool, transaction_id, id)
        .await
        .map_err(|e| anyhow!("Failed to get tags for entry: {}", e))?;

    Ok(Entry::from(entry, tags))
}

pub async fn get_entries_for_transaction(
    pool: &PgPool,
    transaction_id: Uuid,
) -> Result<Vec<Entry>> {
    let entries_db = sqlx::query_as!(
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
    .map_err(|e| anyhow!("Failed to get entries: {}", e))?;

    let mut entries = Vec::new();

    for entry_db in entries_db {
        let tags = services::get_tags_for_entry(pool, entry_db.transaction_id, entry_db.id)
            .await
            .map_err(|e| anyhow!("Failed to get tags for entry: {}", e))?;
        entries.push(Entry::from(entry_db, tags));
    }

    Ok(entries)
}

pub async fn update_entry(
    pool: &PgPool,
    item_id: Uuid,
    name: String,
    amount: i64,
) -> Result<Entry> {
    sqlx::query_as!(
        EntryDb,
        "
        UPDATE entries
        SET name = $2, amount = $3, updated_at = NOW()
        WHERE id = $1
        RETURNING id, public_id, name, amount, transaction_id, created_at, updated_at
        ",
        item_id,
        name,
        amount
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update entry: {}", e))
    .map(|entry| Entry::from(entry, Vec::new()))
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
