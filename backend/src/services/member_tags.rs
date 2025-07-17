use anyhow::{anyhow, Result};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::Tag;

pub async fn get_all_member_tags(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<Vec<Tag>> {
    let query_result = sqlx::query_as!(
        Tag,
        "
        SELECT id, public_id, name, color, split_id, is_custom, created_at, updated_at
        FROM tags
        JOIN member_tags ON tags.id = member_tags.tag_id
        WHERE member_tags.member_id = $1 AND tags.split_id = $2
        ",
        member_id,
        split_id
    )
    .fetch_all(pool)
    .await;

    match query_result {
        Ok(splits) => Ok(splits),
        Err(e) => Err(anyhow!("Failed to get tags: {}", e)),
    }
}

pub async fn add_tag_to_member(
    pool: &PgPool,
    _split_id: Uuid,
    member_id: Uuid,
    tag_id: Uuid,
) -> Result<()> {
    let query_result = sqlx::query!(
        "
        INSERT INTO member_tags (member_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        ",
        member_id,
        tag_id
    )
    .execute(pool)
    .await;

    match query_result {
        Ok(_) => Ok(()),
        Err(e) => Err(anyhow!("Failed to add tag to member: {}", e)),
    }
}

pub async fn remove_tag_from_member(
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
