use std::collections::HashMap;

use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{MemberType, SplitMember, Tag};

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

pub async fn get_members_with_tags(
    pool: &PgPool,
    split_id: Uuid,
) -> Result<HashMap<SplitMember, Vec<Tag>>> {
    let rows = sqlx::query!(
        "
        SELECT member.id AS member_id, member.public_id AS member_public_id, 
               member.name AS member_name, member.created_at AS member_created_at, member.updated_at AS member_updated_at,
               tags.id AS tag_id, tags.public_id AS tag_public_id, tags.is_custom AS tag_is_custom,
               tags.name AS tag_name, tags.color AS tag_color, tags.updated_at AS tag_updated_at, tags.created_at AS tag_created_at
        FROM split_members AS member
        LEFT JOIN member_tags ON member.id = member_tags.member_id
        LEFT JOIN tags ON member_tags.tag_id = tags.id
        WHERE member.split_id = $1
        ",
        split_id
    )
    .fetch_all(pool)
    .await;

    let mut members: HashMap<SplitMember, Vec<Tag>> = HashMap::new();
    match rows {
        Ok(results) => {
            for result in results {
                let member = SplitMember {
                    id: result.member_id,
                    public_id: result.member_public_id,
                    split_id,
                    name: result.member_name,
                    r#type: MemberType::Guest,
                    created_at: result.member_created_at,
                    updated_at: result.member_updated_at,
                };
                let tag = Tag {
                    id: result.tag_id,
                    public_id: result.tag_public_id,
                    name: result.tag_name,
                    color: result.tag_color,
                    split_id,
                    is_custom: result.tag_is_custom,
                    created_at: result.tag_created_at,
                    updated_at: result.tag_updated_at,
                };

                members.entry(member).or_default().push(tag);
            }
        }
        Err(e) => return Err(anyhow!("Failed to get members with tags: {}", e)),
    }

    Ok(members)
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
