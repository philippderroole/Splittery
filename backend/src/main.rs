use axum::{
    Extension,
    http::{Method, header},
};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

mod controllers;
mod middleware;
mod models;
mod routes;
mod services;

use routes::create_routes;

fn cors_layer() -> CorsLayer {
    if cfg!(debug_assertions) {
        CorsLayer::new()
            .allow_origin([
                axum::http::HeaderValue::from_static("http://localhost:3000"),
                axum::http::HeaderValue::from_static("http://127.0.0.1:3000"),
            ])
            .allow_credentials(true)
            .allow_methods([
                Method::GET,
                Method::POST,
                Method::PUT,
                Method::DELETE,
                Method::OPTIONS,
            ])
            .allow_headers([header::CONTENT_TYPE, header::ACCEPT])
    } else {
        CorsLayer::very_permissive()
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    log::info!("Connecting to database at {database_url}");

    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let app = create_routes()
        .layer(cors_layer())
        .layer(Extension(pool.clone()))
        .with_state(pool);

    let listener = TcpListener::bind("0.0.0.0:8000").await?;

    log::info!("Server running on http://localhost:8000");
    axum::serve(listener, app).await?;

    Ok(())
}
