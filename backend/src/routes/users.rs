use axum::{
    routing::{get, post},
    Router,
};
use sqlx::PgPool;

use crate::controllers;

pub fn user_routes() -> Router<PgPool> {
    Router::new()
        .route("/users", get(controllers::get_all_users))
        .route("/users", post(controllers::register_user))
        .route("/users/:user_id", get(controllers::get_user))
}
