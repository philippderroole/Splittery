use std::str::FromStr;

use axum::http::HeaderMap;
use axum::http::header::AUTHORIZATION;
use axum::{extract::State, http::StatusCode};
use sqlx::PgPool;
use uuid::Uuid;

use crate::middleware::jwt::decode_jwt;
use crate::services::{self};

#[axum::debug_handler]
pub async fn logout(
    State(pool): State<PgPool>,
    headers: HeaderMap,
) -> anyhow::Result<(), StatusCode> {
    let claims = headers
        .get(AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .and_then(|token| token.strip_prefix("Bearer "))
        .and_then(|token| decode_jwt(token).ok())
        .ok_or_else(|| {
            log::warn!("Invalid session ID in Authorization header");
            StatusCode::UNAUTHORIZED
        })?;

    let sid = Uuid::from_str(&claims.sid).map_err(|e| {
        log::error!("Invalid session ID: {}", e);
        StatusCode::UNAUTHORIZED
    })?;

    services::logout(&pool, sid).await.map_err(|e| {
        log::error!("Unexpected error during logout: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })
}
