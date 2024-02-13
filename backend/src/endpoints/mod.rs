use actix_cors::Cors;
use actix_web::{web::Data, App, HttpServer};
use sqlx::{Pool, Postgres};

mod splits;
mod transactions;
mod transfer;
mod users;

pub async fn start_web_server(pool: Pool<Postgres>) -> std::io::Result<()> {
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(Data::new(pool.clone()))
            .service(splits::get)
            .service(splits::post)
            .service(transactions::get)
            .service(transactions::post)
            .service(transactions::get_multiple)
            .service(users::get)
            .service(users::post)
            .service(users::get_multiple)
            .service(transfer::get)
            .service(transfer::post)
            .service(transfer::get_multiple)
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}
