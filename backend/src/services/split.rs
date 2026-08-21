use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::{Split, TagType},
    services,
};
use anyhow::anyhow;

pub async fn create_split(pool: &PgPool, name: String) -> Result<Split> {
    let id = Uuid::new_v4();
    let all_color = String::from("#ff5858ff"); // Default color, can be changed later

    let split = sqlx::query_as!(
        Split,
        "
        INSERT INTO splits (id, public_id, name)
        VALUES ($1, $2, $3)
        RETURNING id, public_id, name, created_at, updated_at
        ",
        id,
        id.to_string(),
        name
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to create split: {}", e))?;

    let _tag = services::create_tag(pool, id, &String::from("all"), &all_color, TagType::All)
        .await
        .map_err(|e| anyhow!("Failed to create tag: {}", e))?;

    Ok(split)
}

pub async fn get_splits(pool: &PgPool, user_id: Uuid) -> Result<Vec<Split>> {
    let query_result = sqlx::query_as!(
        Split,
        "
        SELECT id, public_id, name, created_at, updated_at 
        FROM splits
        WHERE id IN (
            SELECT split_id
            FROM split_visits
            WHERE user_id = $1
        )
        ORDER BY created_at DESC
        ",
        user_id
    )
    .fetch_all(pool)
    .await;

    match query_result {
        Ok(splits) => Ok(splits),
        Err(e) => Err(anyhow!("Failed to create split: {}", e)),
    }
}

pub async fn get_split(pool: &PgPool, public_split_id: String) -> Result<Option<Split>> {
    let query_result = sqlx::query_as!(
        Split,
        "
        SELECT id, public_id, name, created_at, updated_at 
        FROM splits 
        WHERE public_id = $1
        ",
        public_split_id
    )
    .fetch_optional(pool)
    .await;

    match query_result {
        Ok(split) => Ok(split),
        Err(e) => Err(anyhow!("Failed to get split: {}", e)),
    }
}

#[derive(Debug)]
pub enum TrackSplitVisitError {
    SplitNotFoundOrNoAccess,
    Unexpected(anyhow::Error),
}

pub async fn track_split_visit(
    pool: &PgPool,
    user_id: Uuid,
    split_id: Uuid,
) -> Result<(), TrackSplitVisitError> {
    let updated = sqlx::query!(
        r#"
        INSERT INTO split_visits (user_id, split_id, first_visited_at, last_visited_at, visit_count)
        VALUES ($1, $2, NOW(), NOW(), 1)
        "#,
        user_id,
        split_id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| {
        TrackSplitVisitError::Unexpected(anyhow::anyhow!("Failed to track split visit: {}", e))
    })?;

    match updated {
        Some(_) => Ok(()),
        None => Err(TrackSplitVisitError::SplitNotFoundOrNoAccess),
    }
}
