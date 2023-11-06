#![feature(proc_macro_hygiene, decl_macro)]

mod endpoints;

use dotenvy::dotenv;
use serde::{Deserialize, Serialize};

pub async fn establish_connection() -> AsyncPgConnection {
    dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    AsyncPgConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running on port 8000");

    let listen_url = dotenvy::var("LISTEN_URL")?;

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(&listen_url)?
    .run()
    .await
}

#[get("/activity")]
async fn get_activity() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/activity")]
async fn post_activity(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}
