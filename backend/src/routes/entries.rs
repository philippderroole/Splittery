use axum::{
    Router,
    routing::{delete, get, post, put},
};
use sqlx::PgPool;

use crate::controllers;

pub fn entry_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/{splitId}/transactions/{transactionId}/entries",
        Router::new()
            .route("/", post(controllers::create_entry))
            .route("/", get(controllers::get_entries_for_transaction))
            .route("/{entryId}", put(controllers::update_entry))
            .route("/{entryId}", delete(controllers::delete_entry)),
    )
}
