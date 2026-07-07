use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::cookie::{Cookie, CookieJar, SameSite};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{
    controllers::create_refresh_cookie,
    services::{self, LoginError},
};

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[axum::debug_handler]
pub async fn login_user(
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

    let access_cookie = Cookie::build(("access_token", access_token.token))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .path("/api/v1")
        .build();

    let refresh_cookie = create_refresh_cookie(refresh_token);

    let jar = jar.add(access_cookie);
    let jar = jar.add(refresh_cookie);

    Ok(jar)
}
