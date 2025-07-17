use axum::{
    Router,
    routing::{delete, get, post},
};
use sqlx::PgPool;

use crate::controllers;

pub fn tags_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/{splitId}",
        Router::new()
            .nest(
                "/members/{memberId}/tags",
                Router::new()
                    .route("/", get(controllers::get_all_member_tags))
                    .route("/{tagId}", post(controllers::add_tag_to_member))
                    .route("/{tagId}", delete(controllers::remove_tag_from_member)),
            )
            .nest(
                "/tags",
                Router::new()
                    .route("/", get(controllers::get_all_split_tags))
                    .route("/", post(controllers::create_tag))
                    .route("/{tagId}", delete(controllers::delete_tag)),
            )
            .nest(
                "/transactions/{transactionId}/entries/{entryId}/tags",
                Router::new()
                    .route("/", get(controllers::get_all_entry_tags))
                    .route("/", post(controllers::add_tag_to_entry))
                    .route("/{tagId}", delete(controllers::remove_tag_from_entry)),
            ),
    )
}
