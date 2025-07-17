use axum::{
    routing::{delete, get, post},
    Router,
};
use sqlx::PgPool;

use crate::controllers;

pub fn transaction_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/:split_url/transactions",
        Router::new()
            .route("/", get(controllers::get_all_transactions))
            .route("/", post(controllers::create_transaction))
            .route("/:transaction_url", get(controllers::get_transaction))
            .route("/:transaction_url", delete(controllers::delete_transaction)),
    )
}
