use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{models::user::User, services};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserResponse {
    pub username: String,
    pub email: String,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        UserResponse {
            username: user.username,
            email: user.email,
        }
    }
}

impl UserResponse {
    pub fn from_vec(user: Vec<User>) -> Vec<Self> {
        user.into_iter().map(UserResponse::from).collect()
    }
}

pub async fn get_user(
    State(pool): State<PgPool>,
    Path(user_id): Path<String>,
) -> Result<Json<UserResponse>, StatusCode> {
    let user_id = user_id.parse().unwrap();

    let user = services::get_user(&pool, &user_id).await.map_err(|e| {
        log::error!("Failed to get user: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(UserResponse::from(user)))
}

pub async fn get_all_users(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<UserResponse>>, StatusCode> {
    let users = services::get_all_users(&pool).await.map_err(|e| {
        log::error!("Failed to get users: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(UserResponse::from_vec(users)))
}
