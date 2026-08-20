use argon2::{
    Argon2, PasswordHash, PasswordHasher, PasswordVerifier,
    password_hash::{SaltString, rand_core::OsRng},
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{controllers::ChangePasswordRequest, models::user::UserIdentity};

pub enum ChangePasswordError {
    InvalidPassword,
    Unexpected(anyhow::Error),
}

pub async fn change_password(
    pool: &PgPool,
    user_id: Uuid,
    payload: ChangePasswordRequest,
) -> anyhow::Result<(), ChangePasswordError> {
    let mut tx = pool.begin().await.map_err(|e| {
        ChangePasswordError::Unexpected(anyhow::anyhow!("Failed to start transaction: {}", e))
    })?;

    let user_identity = sqlx::query_as!(
        UserIdentity,
        "
        SELECT id, user_id, provider, provider_subject, password_hash, created_at
        FROM user_identities
        WHERE provider = 'local' AND user_id = $1
        ",
        user_id,
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| match e {
        _ => {
            ChangePasswordError::Unexpected(anyhow::anyhow!("Failed to load user identity: {}", e))
        }
    })?;

    let existing_hash = user_identity
        .password_hash
        .ok_or(ChangePasswordError::Unexpected(anyhow::anyhow!(
            "No password hash found for user"
        )))?;

    let parsed_hash = PasswordHash::new(&existing_hash).map_err(|e| {
        ChangePasswordError::Unexpected(anyhow::anyhow!("Failed to parse password hash: {}", e))
    })?;

    Argon2::default()
        .verify_password(payload.current_password.as_bytes(), &parsed_hash)
        .map_err(|_| ChangePasswordError::InvalidPassword)?;

    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(payload.new_password.as_bytes(), &salt)
        .map_err(|e| {
            ChangePasswordError::Unexpected(anyhow::anyhow!("Password hashing failed: {}", e))
        })?;

    let _user_identity = sqlx::query_as!(
        UserIdentity,
        "
        UPDATE user_identities
        SET password_hash = $1
        WHERE user_id = $2
        RETURNING id, user_id, provider, provider_subject, password_hash, created_at
        ",
        password_hash.to_string(),
        user_id,
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| {
        ChangePasswordError::Unexpected(anyhow::anyhow!("Failed to update user identity: {}", e))
    })?;

    tx.commit().await.map_err(|e| {
        ChangePasswordError::Unexpected(anyhow::anyhow!("Failed to commit transaction: {}", e))
    })?;

    Ok(())
}
