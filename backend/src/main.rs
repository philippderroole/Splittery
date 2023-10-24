#![feature(proc_macro_hygiene, decl_macro)]

mod endpoints;

use serde::{Deserialize, Serialize};
use tide::{
    http::headers::HeaderValue,
    security::{CorsMiddleware, Origin},
};

#[derive(Debug, Serialize, Deserialize)]
struct Activity {
    id: i32,
    expenses: Vec<Expense>,
    users: Vec<User>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Expense {
    name: String,
    amount: f64,
    description: String,
    balance: Option<Balance>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Balance {
    user: User,
    is_selected: bool,
    amount: f64,
}

#[derive(Debug, Serialize, Deserialize)]
struct User {
    name: String,
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    let url = dotenvy::var("DATABASE_URL")?;
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let cors = CorsMiddleware::new()
        .allow_methods("GET, POST, OPTIONS".parse::<HeaderValue>().unwrap())
        .allow_origin(Origin::from("*"))
        .allow_credentials(false);

    let mut app = tide::with_state(pool);
    app.with(cors);
    app.at("/activity/create")
        .post(endpoints::activity::create_activity);

    app.listen("127.0.0.1:8080").await?;
    Ok(())
}
