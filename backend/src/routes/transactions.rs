use axum::{
    Router,
    routing::{delete, get, post, put},
};
use sqlx::PgPool;

use crate::controllers;

pub fn transaction_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/{splitId}/transactions",
        Router::new()
            .route("/", get(controllers::get_all_transactions))
            .route("/", post(controllers::create_transaction))
            .route("/{transactionId}", put(controllers::update_transaction))
            .route("/{transactionId}", delete(controllers::delete_transaction)),
    )
}
