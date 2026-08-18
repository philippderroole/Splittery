use argon2::{Argon2, PasswordHash, PasswordVerifier};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::{
        Session,
        user::{User, UserIdentity},
    },
    services::{RefreshToken, access_token::AccessToken},
};

pub enum LoginError {
    UserNotFound,
    InvalidPassword,
    Unexpected(anyhow::Error),
}

impl From<sqlx::Error> for LoginError {
    fn from(e: sqlx::Error) -> Self {
        match e {
            sqlx::Error::RowNotFound => LoginError::UserNotFound,
            _ => LoginError::Unexpected(anyhow::anyhow!("Unexpected error: {}", e)),
        }
    }
}

pub async fn login_user(
    pool: &PgPool,
    email: String,
    password: String,
    anonymous_user_id: Option<Uuid>,
) -> anyhow::Result<(AccessToken, RefreshToken), LoginError> {
    let user = sqlx::query_as!(
        User,
        "
        SELECT id, public_id, username, email, email_verified, created_at, updated_at
        FROM users
        WHERE email = $1
        ",
        email
    )
    .fetch_one(pool)
    .await?;

    let user_identity = sqlx::query_as!(
        UserIdentity,
        "
        SELECT id, user_id, provider, provider_subject, password_hash, created_at
        FROM user_identities
        WHERE provider = 'local' AND user_id = $1
        ",
        user.id
    )
    .fetch_one(pool)
    .await?;

    let password_hash = user_identity.password_hash.unwrap().to_string();

    let parsed_hash = PasswordHash::new(&password_hash).map_err(|e| {
        LoginError::Unexpected(anyhow::anyhow!("Failed to parse password hash: {}", e))
    })?;
    Argon2::default()
        .verify_password(password.as_bytes(), &parsed_hash)
        .map_err(|e| {
            log::info!("Password verification failed: {}", e);
            LoginError::InvalidPassword
        })?;

    let refresh_token = RefreshToken::generate().map_err(|e| {
        log::error!("Failed to generate refresh token: {}", e);
        LoginError::Unexpected(e)
    })?;
    let refresh_token_hash = refresh_token.hash().map_err(|e| {
        log::error!("Failed to hash refresh token: {}", e);
        LoginError::Unexpected(e)
    })?;

    let mut tx = pool.begin().await.map_err(|e| {
        LoginError::Unexpected(anyhow::anyhow!("Failed to start login transaction: {}", e))
    })?;

    if let Some(anonymous_user_id) = anonymous_user_id {
        sqlx::query!(
            "
            UPDATE split_members AS anonymous_member
            SET user_id = $1
            WHERE anonymous_member.user_id = $2
              AND NOT EXISTS (
                  SELECT 1 FROM split_members AS logged_in_member
                  WHERE logged_in_member.split_id = anonymous_member.split_id
                    AND logged_in_member.user_id = $1
              )
              AND EXISTS (
                  SELECT 1 FROM users WHERE id = $2 AND is_anonymous = TRUE
              )
            ",
            user.id,
            anonymous_user_id,
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| LoginError::Unexpected(anyhow::anyhow!("Failed to claim splits: {}", e)))?;
    }

    let session = sqlx::query_as!(
        Session,
        "
        INSERT INTO sessions (id, user_id, client_type, refresh_token_hash, refresh_token_expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        ",
        Uuid::new_v4(),
        user.id,
        "web",
        refresh_token_hash,
        refresh_token.token_expires_at
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| LoginError::Unexpected(anyhow::anyhow!("Failed to create session: {}", e)))?;

    tx.commit()
        .await
        .map_err(|e| LoginError::Unexpected(anyhow::anyhow!("Failed to commit login: {}", e)))?;

    let access_token = AccessToken::generate(session.id.to_string(), user.id.to_string())
        .map_err(LoginError::Unexpected)?;

    Ok((access_token, refresh_token))
}
