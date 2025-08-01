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
    tag_ids: Vec<Uuid>,
) -> Result<Entry> {
    if tag_ids.is_empty() {
        return Err(anyhow!("No tags provided for entry"));
    }

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

    services::set_tags_for_entry(pool, id, &tag_ids)
        .await
        .map_err(|e| anyhow!("Failed to add tags to entry: {}", e))?;

    let tags = services::get_tags_for_entry(pool, id)
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
        let tags = services::get_tags_for_entry(pool, entry_db.id)
            .await
            .map_err(|e| anyhow!("Failed to get tags for entry: {}", e))?;
        entries.push(Entry::from(entry_db, tags));
    }

    Ok(entries)
}

pub async fn update_entry(
    pool: &PgPool,
    entry_id: Uuid,
    name: String,
    amount: i64,
    tag_ids: Vec<Uuid>,
) -> Result<Entry> {
    let entry = sqlx::query_as!(
        EntryDb,
        "
        UPDATE entries
        SET name = $2, amount = $3, updated_at = NOW()
        WHERE id = $1
        RETURNING id, public_id, name, amount, transaction_id, created_at, updated_at
        ",
        entry_id,
        name,
        amount
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to update entry: {}", e))?;

    services::set_tags_for_entry(pool, entry_id, &tag_ids)
        .await
        .map_err(|e| anyhow!("Failed to set tags for entry: {}", e))?;

    let tags = services::get_tags_for_entry(pool, entry_id)
        .await
        .map_err(|e| anyhow!("Failed to get tags for entry: {}", e))?;

    Ok(Entry::from(entry, tags))
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
    .await
    .map_err(|e| anyhow!("Failed to delete entry: {}", e))?;

    if query_result.rows_affected() == 0 {
        return Err(anyhow!("Entry with ID {} not found", item_id));
    }

    Ok(())
}
