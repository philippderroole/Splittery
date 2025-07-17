use axum::{
    Router,
    routing::{get, post},
};
use sqlx::PgPool;

use crate::controllers;

pub fn user_routes() -> Router<PgPool> {
    Router::new()
        .route("/users", get(controllers::get_all_users))
        .route("/users", post(controllers::register_user))
        .route("/users/{userId}", get(controllers::get_user))
}
