use sqlx::postgres::PgPoolOptions;

mod endpoints;

#[actix_web::main]
async fn main() {
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(
            dotenvy::var("DATABASE_URL")
                .expect("Missing database url")
                .as_str(),
        )
        .await
        .expect("Failed to connect to database");

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    endpoints::start_web_server(pool)
        .await
        .expect("Failed to start web server");
}
