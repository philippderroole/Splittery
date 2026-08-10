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
    let mut tx = pool
        .begin()
        .await
        .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;

    let session = sqlx::query_as!(Session, "SELECT * FROM sessions WHERE id = $1", session_id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?
        .ok_or_else(|| RefreshError::SessionNotFound)?;

    if session.revoked_at.is_some() || session.refresh_token_expires_at < Utc::now() {
        tx.rollback()
            .await
            .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;
        return Err(RefreshError::InvalidRefreshToken);
    }

    let stored_hash_str = str::from_utf8(&session.refresh_token_hash)
        .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;
    let parsed_hash =
        PasswordHash::new(stored_hash_str).map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;

    Argon2::default()
        .verify_password(refresh_token.as_bytes(), &parsed_hash)
        .map_err(|_| RefreshError::InvalidRefreshToken)?;

    let new_refresh_token = RefreshToken::generate().map_err(RefreshError::Unexpected)?;
    let new_hash = new_refresh_token.hash().map_err(RefreshError::Unexpected)?;

    sqlx::query!(
        "
            UPDATE sessions
            SET refresh_token_hash = $1, refresh_token_expires_at = $2, last_seen_at = NOW()
            WHERE id = $3
            ",
        new_hash,
        new_refresh_token.token_expires_at,
        session_id
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;

    tx.commit()
        .await
        .map_err(|e| RefreshError::Unexpected(anyhow!(e)))?;
    Ok(new_refresh_token)
}
