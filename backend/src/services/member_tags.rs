use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::{Tag, TagDb, TagType},
    services::get_member,
};

pub async fn get_all_member_tags(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<Vec<Tag>> {
    sqlx::query_as!(
        TagDb,
        "
        SELECT id, public_id, name, color, split_id, type AS \"type: TagType\", created_at, updated_at
        FROM tags
        JOIN member_tags ON tags.id = member_tags.tag_id
        WHERE member_tags.member_id = $1 AND tags.split_id = $2
        ",
        member_id,
        split_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get tags: {}", e))
    .map(|tags| tags.into_iter().map(Tag::from).collect())
}

pub async fn get_tags_for_member(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<Vec<Tag>> {
    Ok(sqlx::query_as!(
        TagDb,
        "
        SELECT tags.id, tags.public_id, tags.split_id, tags.type AS \"type: TagType\",
               tags.name, tags.color, tags.updated_at, tags.created_at 
        FROM tags
        JOIN member_tags ON tags.id = member_tags.tag_id
        WHERE tags.split_id = $1 AND member_tags.member_id = $2
        ",
        split_id,
        member_id,
    )
    .fetch_all(pool)
    .await?
    .into_iter()
    .map(Tag::from)
    .collect())
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

pub async fn set_tags_for_member(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
    tag_ids: &Vec<Uuid>,
) -> Result<()> {
    let tags = sqlx::query_as!(
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

    let member = get_member(pool, split_id, member_id)
        .await
        .map_err(|e| anyhow!("Failed to get member: {}", e))?;

    if tags
        .iter()
        .any(|tag| tag.r#type == TagType::UserTag && tag.name != member.name)
    {
        return Err(anyhow!("Cannot set foreign tag for member"));
    }

    sqlx::query!(
        "
        DELETE FROM member_tags 
        WHERE member_id = $1 AND tag_id IN (
            SELECT id FROM tags WHERE type = 'customtag'
        )
        ",
        member_id
    )
    .execute(pool)
    .await?;

    for tag_id in tag_ids {
        sqlx::query!(
            "
            INSERT INTO member_tags (member_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            ",
            member_id,
            tag_id
        )
        .execute(pool)
        .await?;
    }

    Ok(())
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
