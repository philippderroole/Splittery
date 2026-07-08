use ::cookie::time::Duration;
use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use sqlx::PgPool;
use std::str::FromStr;
use uuid::Uuid;

use crate::controllers::access_cookie_builder;
use crate::middleware::jwt::decode_jwt;
use crate::services::access_token::AccessToken;
use crate::services::{self};

#[axum::debug_handler]
pub async fn logout(
    State(pool): State<PgPool>,
    jar: CookieJar,
) -> anyhow::Result<CookieJar, StatusCode> {
    let claims = jar
        .get("access_token")
        .map(|cookie| decode_jwt(cookie.value()).ok())
        .flatten()
        .ok_or_else(|| {
            log::warn!("Invalid or missing access token in cookies");
            StatusCode::UNAUTHORIZED
        })?;

    let sid = Uuid::from_str(&claims.sid).map_err(|e| {
        log::error!("Invalid session ID: {}", e);
        StatusCode::UNAUTHORIZED
    })?;

    let _ = services::logout(&pool, sid).await.map_err(|e| {
        log::error!("Unexpected error during logout: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    });

    let access_token = access_cookie_builder(AccessToken {
        token: String::new(),
    })
    .max_age(Duration::seconds(-1))
    .build();

    let jar = jar.add(access_token);

    Ok(jar)
}
