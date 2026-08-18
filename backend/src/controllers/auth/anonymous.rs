use axum::{extract::State, http::StatusCode};
use axum_extra::extract::cookie::CookieJar;
use sqlx::PgPool;

use crate::services;

pub async fn anonymous_auth(
    State(pool): State<PgPool>,
    jar: CookieJar,
) -> Result<CookieJar, StatusCode> {
    let (access_token, refresh_token) = services::create_anonymous_session(&pool)
        .await
        .map_err(|e| {
            log::error!("Failed to create anonymous session: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(jar.add(access_token).add(refresh_token))
}