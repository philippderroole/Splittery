use axum::{
    Extension,
    extract::Request,
    http::{StatusCode, header::AUTHORIZATION},
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{DecodingKey, Validation, decode};
use sqlx::{PgPool, Pool, Postgres};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Claims {
    // User ID
    pub sub: String,
    // Session ID for token revocation
    pub sid: String,
    pub exp: i64,
    pub iat: i64,
}

// Authentication middleware
pub async fn auth_middleware(
    Extension(pool): Extension<PgPool>,
    request: Request,
    next: Next,
) -> anyhow::Result<Response, StatusCode> {
    let token = request
        .headers()
        .get(AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .and_then(|token| token.strip_prefix("Bearer "))
        .ok_or_else(|| {
            log::warn!("Missing or invalid Authorization header");
            StatusCode::UNAUTHORIZED
        })?;

    let claims = decode_jwt(token).map_err(|e| {
        log::warn!("Failed to decode JWT: {}", e);
        StatusCode::UNAUTHORIZED
    })?;

    validate_user_exists(pool.clone(), &claims).await?;
    validate_session(pool, &claims).await?;

    Ok(next.run(request).await)
}

pub fn decode_jwt(token: &str) -> anyhow::Result<Claims> {
    let jwt_secret = dotenvy::var("JWT_SECRET")?;

    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(jwt_secret.as_ref()),
        &Validation::default(),
    )?
    .claims;

    Ok(claims)
}

async fn validate_user_exists(
    pool: Pool<Postgres>,
    claims: &Claims,
) -> anyhow::Result<(), StatusCode> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(|e| {
        log::error!("Failed to parse user ID: {}", e);
        StatusCode::UNAUTHORIZED
    })?;

    let _user = sqlx::query!("SELECT id FROM users WHERE id = $1", user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| {
            log::error!("Failed to query user from database: {}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?
        .ok_or_else(|| {
            log::warn!("User not found");
            StatusCode::UNAUTHORIZED
        })?;

    Ok(())
}

async fn validate_session(pool: Pool<Postgres>, claims: &Claims) -> anyhow::Result<(), StatusCode> {
    let session_id = Uuid::parse_str(&claims.sid).map_err(|e| {
        log::error!("Failed to parse session ID: {}", e);
        StatusCode::UNAUTHORIZED
    })?;

    let session = sqlx::query!(
        "SELECT id, revoked_at FROM sessions WHERE id = $1",
        session_id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| {
        log::error!("Failed to query session from database: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?
    .ok_or_else(|| {
        log::warn!("Session not found");
        StatusCode::UNAUTHORIZED
    })?;

    if session.revoked_at.is_some() {
        log::warn!("Session has been revoked");
        return Err(StatusCode::UNAUTHORIZED);
    }

    Ok(())
}
