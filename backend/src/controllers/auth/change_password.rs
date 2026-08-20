use axum::{Json, extract::State, http::StatusCode};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::middleware::UserId;
use crate::services::{self, ChangePasswordError};

#[derive(Debug, Serialize, Deserialize)]
pub struct ChangePasswordRequest {
    pub current_password: String,
    pub new_password: String,
}

#[axum::debug_handler]
pub async fn change_password(
    State(pool): State<PgPool>,
    UserId(user_id): UserId,
    Json(payload): Json<ChangePasswordRequest>,
) -> anyhow::Result<(), StatusCode> {
    services::change_password(&pool, user_id, payload)
        .await
        .map_err(|e| match e {
            ChangePasswordError::InvalidPassword => StatusCode::BAD_REQUEST,
            ChangePasswordError::Unexpected(e) => {
                log::error!("Unexpected error during password change: {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    Ok(())
}
