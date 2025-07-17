use axum::{routing::get, Router};
use sqlx::PgPool;

use crate::controllers;

pub fn websocket_routes() -> Router<PgPool> {
    Router::new().route(
        "/api/ws/splits/:split_url",
        get(controllers::ws_split_updates),
    )
}
