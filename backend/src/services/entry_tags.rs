use anyhow::{Result, anyhow};
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{TagDb, TagType};

#[derive(Serialize)]
pub struct EntryTagResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    pub color: String,
    #[serde(rename = "splitId")]
    pub public_split_id: String,
    pub r#type: TagType,
}

impl EntryTagResponse {
    fn from(tag: TagDb, public_split_id: String) -> Self {
        Self {
            public_id: tag.public_id,
            name: tag.name,
            color: tag.color,
            public_split_id,
            r#type: tag.r#type,
        }
    }
}

pub async fn get_all_entry_tags(
    pool: &PgPool,
    split_id: Uuid,
    transaction_id: Uuid,
    entry_id: Uuid,
) -> Result<Vec<EntryTagResponse>> {
    let tags = sqlx::query_as!(
        TagDb,
        "
        SELECT tags.id, tags.public_id, tags.name, color, tags.split_id, type AS \"type: TagType\", tags.created_at, tags.updated_at
        FROM tags
        JOIN entry_tags ON tags.id = entry_tags.tag_id
        JOIN entries ON entry_tags.entry_id = entries.id
        WHERE tags.split_id = $1 AND entries.transaction_id = $2 AND entry_tags.entry_id = $3
        ",
        split_id,
        transaction_id,
        entry_id,
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get tags: {}", e))?;

    let tags = tags
        .into_iter()
        .map(|tag| EntryTagResponse::from(tag, split_id.to_string()))
        .collect();

    Ok(tags)
}

pub async fn add_tag_to_entry(
    pool: &PgPool,
    _split_id: Uuid,
    _transaction_id: Uuid,
    entry_id: Uuid,
    tag_id: Uuid,
) -> Result<()> {
    let query_result = sqlx::query!(
        "
        INSERT INTO entry_tags (entry_id, tag_id)
        VALUES ($1, $2)
        ",
        entry_id,
        tag_id
    )
    .execute(pool)
    .await;

    match query_result {
        Ok(_) => Ok(()),
        Err(e) => Err(anyhow!("Failed to add tag to member: {}", e)),
    }
}

pub async fn set_tags_for_entry(pool: &PgPool, entry_id: Uuid, tag_ids: &Vec<Uuid>) -> Result<()> {
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
        DELETE FROM entry_tags 
        WHERE entry_id = $1
        ",
        entry_id
    )
    .execute(pool)
    .await?;

    for tag_id in tag_ids {
        sqlx::query!(
            "
            INSERT INTO entry_tags (entry_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            ",
            entry_id,
            tag_id
        )
        .execute(pool)
        .await?;
    }

    Ok(())
}

pub async fn remove_tag_from_entry(
    pool: &PgPool,
    _split_id: Uuid,
    member_id: Uuid,
    tag_id: Uuid,
) -> Result<()> {
    let query_result = sqlx::query!(
        "
        DELETE FROM member_tags 
        WHERE member_id = $1 AND tag_id = $2
        ",
        member_id,
        tag_id
    )
    .execute(pool)
    .await;

    match query_result {
        Ok(result) if result.rows_affected() > 0 => Ok(()),
        Ok(_) => Err(anyhow!("Tag not found for member")),
        Err(e) => Err(anyhow!("Failed to remove tag from member: {}", e)),
    }
}
