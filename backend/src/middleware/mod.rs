use std::str::FromStr;

use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};
use uuid::Uuid;

use crate::middleware::token_validation::Claims;

pub mod token_validation;

pub struct SessionId(pub Uuid);
pub struct UserId(pub Uuid);

impl<S> FromRequestParts<S> for SessionId
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let claims = parts
            .extensions
            .get::<Claims>()
            .ok_or(StatusCode::UNAUTHORIZED)?;

        let sid = Uuid::from_str(&claims.sid).map_err(|_| StatusCode::UNAUTHORIZED)?;
        Ok(SessionId(sid))
    }
}

impl<S> FromRequestParts<S> for UserId
where
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let claims = parts
            .extensions
            .get::<Claims>()
            .ok_or(StatusCode::UNAUTHORIZED)?;

        let user_id = Uuid::from_str(&claims.sub).map_err(|_| StatusCode::UNAUTHORIZED)?;
        Ok(UserId(user_id))
    }
}
