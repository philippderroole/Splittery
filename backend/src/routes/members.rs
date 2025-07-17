use axum::{
    routing::{delete, get, post},
    Router,
};
use sqlx::PgPool;

use crate::controllers;

pub fn members_routes() -> Router<PgPool> {
    Router::new().nest(
        "/splits/:split_url/members",
        Router::new()
            .route("/", get(controllers::get_all_members))
            .route("/", post(controllers::create_member))
            .route("/:member_url", delete(controllers::delete_member)),
    )
}
