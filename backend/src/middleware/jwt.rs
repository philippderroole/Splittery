use axum::{
    extract::{Request, State},
    http::{header::AUTHORIZATION, StatusCode},
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use sqlx::PgPool;
use uuid::Uuid;

// Extract the user ID from the request
#[derive(Clone)]
pub struct CurrentUser {
    pub id: Uuid,
    pub email: String,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub email: String,
    // Other fields can be added as needed
}

// Authentication middleware
pub async fn auth_middleware(
    State(pool): State<PgPool>,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = request
        .headers()
        .get(AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    if !auth_header.starts_with("Bearer ") {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let token = &auth_header[7..]; // Remove "Bearer " prefix

    // JWT secret (should match the one in auth_user.rs)
    const JWT_SECRET: &str = "your-secret-key";

    // Decode and validate JWT token
    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?
    .claims;

    // Parse user ID from claims
    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| StatusCode::UNAUTHORIZED)?;

    // Verify user still exists in database
    let user_exists = sqlx::query!("SELECT id FROM users WHERE id = $1", user_id)
        .fetch_optional(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .is_some();

    if !user_exists {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Add user to request extensions for handlers to access
    let current_user = CurrentUser {
        id: user_id,
        email: claims.email,
    };

    request.extensions_mut().insert(current_user);

    Ok(next.run(request).await)
}
