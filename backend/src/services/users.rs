use anyhow::Result;
use anyhow::anyhow;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::user::User;

pub async fn get_user(pool: &PgPool, user_id: &Uuid) -> Result<User> {
    let query_result = sqlx::query_as!(
        User,
        r#"
        SELECT id, public_id, username, email, email_verified, created_at, updated_at
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
        SELECT id, public_id, username, email, email_verified, created_at, updated_at
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
