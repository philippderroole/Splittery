use axum::{Router, routing::get};
use sqlx::PgPool;

use crate::controllers;

pub fn websocket_routes() -> Router<PgPool> {
    Router::new().route("/ws/splits/{splitId}", get(controllers::ws_split_updates))
}
