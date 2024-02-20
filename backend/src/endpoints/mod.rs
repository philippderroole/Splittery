use actix_cors::Cors;
use actix_web::{web::Data, App, HttpServer};
use sqlx::{Pool, Postgres};

mod splits;
mod transactions;
mod users;

pub async fn start_web_server(pool: Pool<Postgres>) -> std::io::Result<()> {
    let listen_url = dotenvy::var("LISTEN_URL").unwrap();
    let listen_port: u16 = dotenvy::var("LISTEN_PORT").unwrap().parse().unwrap();

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
            .service(splits::put)
            .service(transactions::get)
            .service(transactions::post)
            .service(transactions::put)
            .service(transactions::delete)
            .service(transactions::get_multiple)
            .service(users::get)
            .service(users::post)
            .service(users::put)
            .service(users::delete)
            .service(users::get_multiple)
    })
    .bind((listen_url, listen_port))?
    .run()
    .await
}
