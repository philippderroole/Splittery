use axum::{
    Router,
    routing::{get, post},
};
use sqlx::PgPool;

use crate::controllers;

pub fn split_routes() -> Router<PgPool> {
    Router::new()
        .route("/splits", get(controllers::get_all_splits))
        .route("/splits", post(controllers::create_split))
        .route("/splits/{splitId}", get(controllers::get_split))
}
