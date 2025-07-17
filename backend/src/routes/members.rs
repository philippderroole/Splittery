use axum::{
    Router,
    routing::{delete, get, post},
};
use sqlx::PgPool;

use crate::controllers;

pub fn members_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/{splitId}/members",
        Router::new()
            .route("/", get(controllers::get_all_members))
            .route("/", post(controllers::create_member))
            .route("/{memberId}", delete(controllers::delete_member)),
    )
}
