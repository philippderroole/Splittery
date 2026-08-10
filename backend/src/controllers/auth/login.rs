use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::cookie::CookieJar;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::services::{self, LoginError};

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[axum::debug_handler]
pub async fn password_web_login(
    State(pool): State<PgPool>,
    jar: CookieJar,
    Json(payload): Json<LoginRequest>,
) -> anyhow::Result<CookieJar, StatusCode> {
    let (access_token, refresh_token) =
        services::login_user(&pool, payload.email, payload.password)
            .await
            .map_err(|e| match e {
                LoginError::UserNotFound => StatusCode::UNAUTHORIZED,
                LoginError::InvalidPassword => StatusCode::UNAUTHORIZED,
                LoginError::Unexpected(e) => {
                    log::error!("Unexpected error during login: {e}");
                    StatusCode::INTERNAL_SERVER_ERROR
                }
            })?;

    let jar = jar.add(access_token);
    let jar = jar.add(refresh_token);

    Ok(jar)
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
}

#[axum::debug_handler]
pub async fn password_tauri_login(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> anyhow::Result<Json<LoginResponse>, StatusCode> {
    let (access_token, refresh_token) =
        services::login_user(&pool, payload.email, payload.password)
            .await
            .map_err(|e| match e {
                LoginError::UserNotFound => StatusCode::UNAUTHORIZED,
                LoginError::InvalidPassword => StatusCode::UNAUTHORIZED,
                LoginError::Unexpected(e) => {
                    log::error!("Unexpected error during login: {e}");
                    StatusCode::INTERNAL_SERVER_ERROR
                }
            })?;

    Ok(Json(LoginResponse {
        access_token: access_token.into(),
        refresh_token: refresh_token.into(),
    }))
}
