use argon2::password_hash::SaltString;
use argon2::password_hash::rand_core::OsRng;
use argon2::{Argon2, PasswordHasher};
use sqlx::PgPool;
use uuid::Uuid;

use crate::controllers::CreateUserRequest;
use crate::models::user::{User, UserIdentity};

pub enum RegisterError {
    AlreadyExists,
    Unexpected(anyhow::Error),
}

pub async fn register_user(
    pool: &PgPool,
    payload: CreateUserRequest,
) -> anyhow::Result<User, RegisterError> {
    let mut tx = pool.begin().await.map_err(|e| {
        RegisterError::Unexpected(anyhow::anyhow!("Failed to start transaction: {}", e))
    })?;

    let user = sqlx::query_as!(
        User,
        "
        INSERT INTO users (id, public_id, email, username, email_verified)
        VALUES ($1, $2, $3, $4, FALSE)
        RETURNING id, public_id, username, email, email_verified, created_at, updated_at
        ",
        Uuid::new_v4(),
        Uuid::new_v4().to_string(),
        payload.email,
        payload.username,
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| {
        if let sqlx::Error::Database(db_err) = &e
            && db_err.code() == Some("23505".into())
        {
            return RegisterError::AlreadyExists;
        }
        RegisterError::Unexpected(anyhow::anyhow!("Failed to register user: {}", e))
    })?;

    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|e| {
            RegisterError::Unexpected(anyhow::anyhow!("Password hashing failed: {}", e))
        })?;

    let _user_identity = sqlx::query_as!(
        UserIdentity,
        "
        INSERT INTO user_identities (id, user_id, provider, password_hash)
        VALUES ($1, $2, 'local', $3)
        RETURNING id, user_id, provider, provider_subject, password_hash, created_at
        ",
        Uuid::new_v4(),
        user.id,
        password_hash.to_string()
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| {
        RegisterError::Unexpected(anyhow::anyhow!("Failed to create user identity: {}", e))
    })?;

    tx.commit().await.map_err(|e| {
        RegisterError::Unexpected(anyhow::anyhow!("Failed to commit transaction: {}", e))
    })?;

    Ok(user)
}
