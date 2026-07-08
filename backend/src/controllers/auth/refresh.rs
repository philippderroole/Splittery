use std::str::FromStr;

use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use jsonwebtoken::{DecodingKey, Validation, decode};
use sqlx::PgPool;
use uuid::Uuid;

use crate::services::RefreshError;
use crate::{
    middleware::jwt::Claims,
    services::{self},
};

pub async fn refresh_token(
    State(pool): State<PgPool>,
    jar: CookieJar,
) -> anyhow::Result<CookieJar, StatusCode> {
    let claims = jar
        .get("access_token")
        .map(|cookie| decode_jwt_for_refresh(cookie.value()).ok())
        .flatten()
        .ok_or_else(|| {
            log::warn!("Invalid or missing access token in cookies");
            StatusCode::UNAUTHORIZED
        })?;

    let sid = Uuid::from_str(&claims.sid).map_err(|e| {
        log::error!("Invalid session ID: {}", e);
        StatusCode::UNAUTHORIZED
    })?;

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

fn decode_jwt_for_refresh(token: &str) -> anyhow::Result<Claims> {
    let jwt_secret = dotenvy::var("JWT_SECRET")?;

    let mut validation = Validation::default();
    validation.validate_exp = false;

    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_ref()),
        &validation,
    )?
    .claims;

    Ok(claims)
}
