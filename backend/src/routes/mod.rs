use axum::Router;
use sqlx::PgPool;

mod entries;
mod members;
mod splits;
mod tags;
mod transactions;
mod users;
mod websocket;

use entries::entry_routes;
use splits::split_routes;
use tags::tags_routes;
use transactions::transaction_routes;
use users::user_routes;
use websocket::websocket_routes;

use crate::routes::members::members_routes;

pub fn create_routes() -> Router<PgPool> {
    Router::new().nest(
        "/api/v1",
        Router::new()
            .merge(split_routes())
            .merge(transaction_routes())
            .merge(websocket_routes())
            .merge(user_routes())
            .merge(entry_routes())
            .merge(tags_routes())
            .merge(members_routes()),
    )
}
