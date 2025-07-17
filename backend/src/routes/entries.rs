use axum::{
    Router,
    routing::{delete, get, post},
};
use sqlx::PgPool;

use crate::controllers;

pub fn entry_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/{splitId}/transactions/{transactionId}/entries",
        Router::new()
            .route("/", get(controllers::get_all_transaction_entries))
            .route("/", post(controllers::create_transaction_entry))
            .route("/{entryId}", delete(controllers::delete_entry)),
    )
}
