use axum::{
    routing::{delete, get, post},
    Router,
};
use sqlx::PgPool;

use crate::controllers;

pub fn entry_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/:split_url/transactions/:transaction_url/entries",
        Router::new()
            .route("/", get(controllers::get_all_transaction_entries))
            .route("/", post(controllers::create_transaction_entry))
            .route("/:entry_id", delete(controllers::delete_entry)),
    )
}
