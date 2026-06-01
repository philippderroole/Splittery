use anyhow::anyhow;
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use chrono::Utc;
use sqlx::PgPool;
use std::str;
use uuid::Uuid;

use crate::{models::Session, services::RefreshToken};

#[derive(Debug)]
pub enum RefreshError {
    InvalidRefreshToken,
    SessionNotFound,
    Unexpected(anyhow::Error),
}

pub async fn refresh_token(
    pool: &PgPool,
    session_id: Uuid,
    refresh_token: &str,
) -> anyhow::Result<RefreshToken, RefreshError> {
    validate_refresh_token(&pool, session_id, refresh_token).await?;

    let new_refresh_token = RefreshToken::generate().map_err(|e| RefreshError::Unexpected(e))?;

    sqlx::query!(
        "
            UPDATE sessions
            SET refresh_token_hash = $1, refresh_token_expires_at = $2
            WHERE id = $3
            ",
        new_refresh_token
            .hash()
            .map_err(|e| RefreshError::Unexpected(e))?,
        new_refresh_token.token_expires_at,
        session_id
    )
    .execute(pool)
    .await
    .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;

    Ok(new_refresh_token)
}

async fn validate_refresh_token(
    pool: &PgPool,
    session_id: Uuid,
    refresh_token: &str,
) -> anyhow::Result<(), RefreshError> {
    let session = sqlx::query_as!(Session, "SELECT * FROM sessions WHERE id = $1", session_id)
        .fetch_optional(pool)
        .await
        .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?
        .ok_or_else(|| RefreshError::SessionNotFound)?;

    if session.revoked_at.is_some() {
        log::warn!(
            "Attempt to refresh token for revoked session: {}",
            session_id
        );
        return Err(RefreshError::InvalidRefreshToken);
    }

    if session.refresh_token_expires_at < Utc::now() {
        log::warn!(
            "Attempt to refresh token with expired refresh token for session: {}",
            session_id
        );
        return Err(RefreshError::InvalidRefreshToken);
    }

    let stored_hash_str = str::from_utf8(&session.refresh_token_hash)
        .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;

    let parsed_hash =
        PasswordHash::new(stored_hash_str).map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;

    Argon2::default()
        .verify_password(refresh_token.as_bytes(), &parsed_hash)
        .map_err(|_| RefreshError::InvalidRefreshToken)?;

    Ok(())
}
