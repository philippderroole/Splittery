use axum::{Extension, extract::Request, http::StatusCode, middleware::Next, response::Response};
use axum_extra::extract::CookieJar;
use jsonwebtoken::{DecodingKey, Validation, decode};
use sqlx::{PgPool, Pool, Postgres};
use uuid::Uuid;

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub sid: String,
    pub exp: i64,
    pub iat: i64,
}

pub async fn validate_access_token(
    Extension(pool): Extension<PgPool>,
    jar: CookieJar,
    mut request: Request,
    next: Next,
) -> anyhow::Result<Response, StatusCode> {
    let claims = jar
        .get("access_token")
        .map(|cookie| decode_jwt(cookie.value()).ok())
        .flatten()
        .ok_or_else(|| {
            log::warn!("Invalid or missing access token in cookies");
            StatusCode::UNAUTHORIZED
        })?;

    validate_user_exists(pool.clone(), &claims).await?;
    validate_session(pool, &claims).await?;

    request.extensions_mut().insert(claims);
    Ok(next.run(request).await)
}

pub async fn validate_access_token_for_refresh(
    Extension(pool): Extension<PgPool>,
    jar: CookieJar,
    mut request: Request,
    next: Next,
) -> anyhow::Result<Response, StatusCode> {
    let claims = jar
        .get("access_token")
        .map(|cookie| decode_jwt_for_refresh(cookie.value()).ok())
        .flatten()
        .ok_or(StatusCode::UNAUTHORIZED)?;

    validate_session(pool, &claims).await?;

    request.extensions_mut().insert(claims);
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
