use axum::{
    routing::{get, post},
    Router,
};
use sqlx::PgPool;

use crate::controllers;

pub fn split_routes() -> Router<PgPool> {
    Router::new()
        .route("/splits", get(controllers::get_all_splits))
        .route("/splits", post(controllers::create_split))
        .route("/splits/:split_url", get(controllers::get_split))
}
