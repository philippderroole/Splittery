use sqlx::postgres::PgPoolOptions;

mod endpoints;

#[actix_web::main]
async fn main() {
    let pool = PgPoolOptions::new()
        .max_connections(1)
        .connect(dotenv::var("DATABASE_URL").unwrap().as_str())
        .await
        .unwrap();

    endpoints::start_web_server(pool).await.unwrap();
}
