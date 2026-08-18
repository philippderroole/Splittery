use axum::{Json, extract::State, http::{HeaderMap, StatusCode}};
use axum_extra::extract::cookie::CookieJar;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::services::{self, LoginError};
use crate::middleware::token_validation::{extract_access_token, validate_access_token_string};

async fn anonymous_user_from_access_token(
    pool: &PgPool,
    jar: &CookieJar,
    headers: &HeaderMap,
) -> Result<Option<uuid::Uuid>, StatusCode> {
    let Some(token) = extract_access_token(jar, headers) else {
        return Ok(None);
    };
    let claims = validate_access_token_string(pool, &token).await?;
    let user_id: uuid::Uuid = claims.sub.parse().map_err(|_| StatusCode::UNAUTHORIZED)?;
    let is_anonymous = sqlx::query_scalar!(
        "SELECT is_anonymous FROM users WHERE id = $1",
        user_id
    )
    .fetch_one(pool)
    .await
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(is_anonymous.then_some(user_id))
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[axum::debug_handler]
pub async fn password_web_login(
    State(pool): State<PgPool>,
    jar: CookieJar,
    headers: HeaderMap,
    Json(payload): Json<LoginRequest>,
) -> anyhow::Result<CookieJar, StatusCode> {
    let anonymous_user_id = anonymous_user_from_access_token(&pool, &jar, &headers).await?;
    let (access_token, refresh_token) =
        services::login_user(&pool, payload.email, payload.password, anonymous_user_id)
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
    headers: HeaderMap,
    Json(payload): Json<LoginRequest>,
) -> anyhow::Result<Json<LoginResponse>, StatusCode> {
    let anonymous_user_id = anonymous_user_from_access_token(&pool, &CookieJar::new(), &headers).await?;
    let (access_token, refresh_token) =
        services::login_user(&pool, payload.email, payload.password, anonymous_user_id)
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
