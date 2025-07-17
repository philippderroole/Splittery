use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{models::Split, services};
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

    let _tag = services::create_tag(pool, id, &String::from("all"), &all_color, false)
        .await
        .map_err(|e| anyhow!("Failed to create tag: {}", e))?;

    Ok(split)
}

pub async fn get_splits(pool: &PgPool) -> Result<Vec<Split>> {
    let query_result = sqlx::query_as!(
        Split,
        "
        SELECT id, public_id, name, created_at, updated_at 
        FROM splits
        "
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
