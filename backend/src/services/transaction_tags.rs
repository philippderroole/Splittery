use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{Tag, TagDb, TagType};

pub async fn get_tags_for_transaction(
    pool: &PgPool,
    split_id: Uuid,
    transaction_id: Uuid,
) -> Result<Vec<Tag>> {
    let tags = sqlx::query_as!(
        TagDb,
        "
        SELECT id, public_id, name, color, split_id, type AS \"type: TagType\", created_at, updated_at
        FROM tags
        WHERE split_id = $1 AND id IN (
            SELECT tag_id FROM transaction_tags WHERE transaction_id = $2
        )
        ",
        split_id,
        transaction_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get tags for transaction: {}", e))?;

    Ok(tags.into_iter().map(Tag::from).collect())
}

pub async fn set_tags_for_transaction(
    pool: &PgPool,
    transaction_id: Uuid,
    tag_ids: &Vec<Uuid>,
) -> Result<()> {
    let _tags = sqlx::query_as!(
        TagDb,
        "
        SELECT id, public_id, name, color, split_id, type AS \"type: TagType\", created_at, updated_at
        FROM tags
        WHERE id = ANY($1) 
        ",
        &tag_ids
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to fetch tags: {}", e))?;

    sqlx::query!(
        "
        DELETE FROM transaction_tags 
        WHERE transaction_id = $1
        ",
        transaction_id
    )
    .execute(pool)
    .await?;

    for tag_id in tag_ids {
        sqlx::query!(
            "
            INSERT INTO transaction_tags (transaction_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            ",
            transaction_id,
            tag_id
        )
        .execute(pool)
        .await?;
    }

    Ok(())
}
