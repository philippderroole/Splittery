use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

mod controllers;
mod middleware;
mod models;
mod responses;
mod routes;
mod services;

use routes::create_routes;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    env_logger::init();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(20)
        .connect(&database_url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let app = create_routes()
        .layer(CorsLayer::very_permissive())
        .with_state(pool);

    let listener = TcpListener::bind("0.0.0.0:8000").await?;

    log::info!("Server running on http://localhost:8000");
    axum::serve(listener, app).await?;

    Ok(())
}
