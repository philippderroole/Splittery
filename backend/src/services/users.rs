use anyhow::anyhow;
use anyhow::Result;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{controllers::CreateUserRequest, models::user::User};

pub async fn register_user(pool: &PgPool, payload: CreateUserRequest) -> Result<User> {
    let user_id = Uuid::new_v4();
    let query_result = sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (id, public_id, email, username, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, public_id, email, username, password_hash, created_at, updated_at
        "#,
        user_id,
        user_id.to_string(),
        payload.email,
        payload.username,
        payload.password_hash
    )
    .fetch_one(pool)
    .await;

    match query_result {
        Ok(user) => Ok(user),
        Err(e) => Err(anyhow!("Failed to register user: {}", e)),
    }
}

pub async fn get_user(pool: &PgPool, user_id: &Uuid) -> Result<User> {
    let query_result = sqlx::query_as!(
        User,
        r#"
        SELECT id, public_id, email, username, password_hash, created_at, updated_at
        FROM users
        WHERE id = $1
        "#,
        user_id
    )
    .fetch_one(pool)
    .await;

    match query_result {
        Ok(user) => Ok(user),
        Err(e) => Err(anyhow!("Failed to get user: {}", e)),
    }
}

pub async fn get_all_users(pool: &PgPool) -> Result<Vec<User>> {
    let query_result = sqlx::query_as!(
        User,
        r#"
        SELECT id, public_id, email, username, password_hash, created_at, updated_at
        FROM users
        "#
    )
    .fetch_all(pool)
    .await;

    match query_result {
        Ok(users) => Ok(users),
        Err(e) => Err(anyhow!("Failed to get users: {}", e)),
    }
}
