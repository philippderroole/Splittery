#![feature(proc_macro_hygiene, decl_macro)]

mod endpoints;

use serde::{Deserialize, Serialize};
use tide::{
    http::headers::HeaderValue,
    security::{CorsMiddleware, Origin},
};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Activity {
    id: String,
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
    activity: Activity,
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    let url = dotenvy::var("DATABASE_URL")?;
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let cors = CorsMiddleware::new()
        .allow_methods("GET, POST, PUT, DELETE".parse::<HeaderValue>().unwrap())
        .allow_origin(Origin::from("*"))
        .allow_credentials(false);

    let mut app = tide::with_state(pool);
    app.with(cors);

    app.at("/activity/create")
        .post(endpoints::activity::create_activity);
    app.at("/activity/get")
        .post(endpoints::activity::get_activity);

    app.at("/user/create").post(endpoints::user::create_user);
    app.at("/user/getAll").post(endpoints::user::get_all_users);

    app.at("/expense/getAll")
        .post(endpoints::expense::get_all_expenses);

    println!("Server running on port 8000");

    let listen_url = dotenvy::var("LISTEN_URL")?;
    app.listen(&listen_url).await?;
    Ok(())
}
