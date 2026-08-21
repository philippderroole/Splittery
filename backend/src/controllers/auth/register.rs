use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::services::access_token::AccessToken;
use crate::services::auth::register::RegisterError;
use crate::services::{self, RefreshToken};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

pub async fn password_web_register(
    State(pool): State<PgPool>,
    jar: CookieJar,
    Json(payload): Json<CreateUserRequest>,
) -> anyhow::Result<CookieJar, StatusCode> {
    let (access_token, refresh_token) =
        services::register_user(&pool, payload)
            .await
            .map_err(|e| match e {
                RegisterError::AlreadyExists => StatusCode::CONFLICT,
                RegisterError::Unexpected(e) => {
                    log::error!("Unexpected error during registration: {e}");
                    StatusCode::INTERNAL_SERVER_ERROR
                }
            })?;

    let jar = jar.add(access_token);
    let jar = jar.add(refresh_token);

    Ok(jar)
}

#[axum::debug_handler]
pub async fn password_tauri_register(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateUserRequest>,
) -> anyhow::Result<Json<(AccessToken, RefreshToken)>, StatusCode> {
    let (access_token, refresh_token) =
        services::register_user(&pool, payload)
            .await
            .map_err(|e| match e {
                RegisterError::AlreadyExists => StatusCode::CONFLICT,
                RegisterError::Unexpected(e) => {
                    log::error!("Unexpected error during registration: {e}");
                    StatusCode::INTERNAL_SERVER_ERROR
                }
            })?;

    Ok(Json((access_token, refresh_token)))
}
