use anyhow::anyhow;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{models::Session, services::{RefreshToken, access_token::AccessToken}};

pub async fn create_anonymous_session(
    pool: &PgPool,
) -> anyhow::Result<(AccessToken, RefreshToken)> {
    let user_id = Uuid::new_v4();
    let session_id = Uuid::new_v4();
    let refresh_token = RefreshToken::generate_permanent()?;
    let refresh_token_hash = refresh_token.hash()?;

    let mut tx = pool.begin().await?;

    sqlx::query!(
        "
        INSERT INTO users (id, public_id, username, email, email_verified, is_anonymous)
        VALUES ($1, $2, $3, $4, FALSE, TRUE)
        ",
        user_id,
        user_id.to_string(),
        "Anonymous",
        format!("{}@anonymous.splittery", user_id),
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| anyhow!("Failed to create anonymous user: {}", e))?;

    sqlx::query_as!(
        Session,
        "
        INSERT INTO sessions (id, user_id, client_type, refresh_token_hash, refresh_token_expires_at)
        VALUES ($1, $2, $3, $4, NULL)
        RETURNING *
        ",
        session_id,
        user_id,
        "web",
        refresh_token_hash,
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| anyhow!("Failed to create anonymous session: {}", e))?;

    tx.commit().await?;

    let access_token = AccessToken::generate(session_id.to_string(), user_id.to_string())?;
    Ok((access_token, refresh_token))
}