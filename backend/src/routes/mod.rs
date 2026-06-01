use axum::{Router, middleware};
use sqlx::PgPool;

mod auth;
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

use crate::middleware::jwt::auth_middleware;
use crate::routes::{auth::auth_routes, members::members_routes};

pub fn create_routes() -> Router<PgPool> {
    let protected_routes = Router::new()
        .merge(split_routes())
        .merge(transaction_routes())
        .merge(websocket_routes())
        .merge(user_routes())
        .merge(entry_routes())
        .merge(tags_routes())
        .merge(members_routes())
        .layer(middleware::from_fn(auth_middleware));

    let public_routes = Router::new().merge(auth_routes());

    Router::new().nest(
        "/api/v1",
        Router::new().merge(public_routes).merge(protected_routes),
    )
}
