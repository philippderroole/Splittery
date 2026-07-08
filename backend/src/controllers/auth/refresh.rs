use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use sqlx::PgPool;

use crate::middleware::SessionId;
use crate::services::RefreshError;
use crate::services::{self};

pub async fn refresh_token(
    State(pool): State<PgPool>,
    SessionId(sid): SessionId,
    jar: CookieJar,
) -> anyhow::Result<CookieJar, StatusCode> {
    let refresh_token_cookie = jar.get("refresh_token").ok_or_else(|| {
        log::warn!("Missing refresh token in cookies");
        StatusCode::UNAUTHORIZED
    })?;

    let refresh_token = services::refresh_token(&pool, sid, &refresh_token_cookie.value())
        .await
        .map_err(|e| match e {
            RefreshError::Unexpected(e) => {
                log::error!("Unexpected error during token refresh: {}", e);
                StatusCode::INTERNAL_SERVER_ERROR
            }
            _ => StatusCode::UNAUTHORIZED,
        })?;

    let jar = jar.add(refresh_token);

    Ok(jar)
}
