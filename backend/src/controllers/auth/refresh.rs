use axum::{
    Json,
    extract::State,
    http::{HeaderMap, StatusCode, header::AUTHORIZATION},
};
use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};
use jsonwebtoken::{DecodingKey, Validation, decode};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::services::RefreshError;
use crate::{
    middleware::jwt::Claims,
    services::{self},
};

#[derive(Debug, Deserialize)]
pub struct RefreshTokenRequest {
    refresh_token: String,
}

pub async fn refresh_token(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    jar: CookieJar,
    Json(payload): Json<RefreshTokenRequest>,
) -> anyhow::Result<CookieJar, StatusCode> {
    let refresh_token = services::refresh_token(&pool, &payload.refresh_token)
        .await
        .map_err(|e| match e {
            RefreshError::Unexpected(e) => {
                log::error!("Unexpected error during token refresh: {}", e);
                StatusCode::INTERNAL_SERVER_ERROR
            }
            _ => StatusCode::UNAUTHORIZED,
        })?;

    let refresh_cookie = Cookie::build(("refresh_token", refresh_token.token))
        .http_only(true)
        .secure(true) // Recommended for production
        .same_site(SameSite::Strict)
        .path("/")
        .build();

    let jar = jar.add(refresh_cookie);

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
