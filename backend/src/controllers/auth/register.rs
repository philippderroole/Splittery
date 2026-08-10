use axum::{Json, extract::State, http::StatusCode};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::controllers::UserResponse;
use crate::services::auth::register::RegisterError;
use crate::services::{self};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

pub async fn password_web_register(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateUserRequest>,
) -> anyhow::Result<Json<UserResponse>, StatusCode> {
    let user = services::register_user(&pool, payload)
        .await
        .map_err(|e| match e {
            RegisterError::AlreadyExists => StatusCode::CONFLICT,
            RegisterError::Unexpected(e) => {
                log::error!("Unexpected error during registration: {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    Ok(Json(UserResponse::from(user)))
}

pub async fn password_tauri_register(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateUserRequest>,
) -> anyhow::Result<Json<UserResponse>, StatusCode> {
    let user = services::register_user(&pool, payload)
        .await
        .map_err(|e| match e {
            RegisterError::AlreadyExists => StatusCode::CONFLICT,
            RegisterError::Unexpected(e) => {
                log::error!("Unexpected error during registration: {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    Ok(Json(UserResponse::from(user)))
}
