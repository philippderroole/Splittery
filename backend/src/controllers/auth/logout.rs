use axum::{extract::State, http::StatusCode};
use axum_extra::extract::CookieJar;
use sqlx::PgPool;

use crate::middleware::SessionId;
use crate::services::access_token::AccessToken;
use crate::services::{self, RefreshToken};

#[axum::debug_handler]
pub async fn logout(
    State(pool): State<PgPool>,
    SessionId(sid): SessionId,
    jar: CookieJar,
) -> anyhow::Result<CookieJar, StatusCode> {
    let _ = services::logout(&pool, sid).await.map_err(|e| {
        log::error!("Unexpected error during logout: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    });

    let access_token = AccessToken::expired();
    let refresh_token = RefreshToken::expired();

    let jar = jar.add(access_token);
    let jar = jar.add(refresh_token);

    Ok(jar)
}
