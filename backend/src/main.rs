#![feature(proc_macro_hygiene, decl_macro)]

mod endpoints;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Activity {
    id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Expense {
    id: String,
    name: String,
    amount: f64,
    user: User,
    balances: Vec<Balance>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Balance {
    is_selected: bool,
    amount: f64,
    share: f64,
    user: User,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct User {
    name: String,
    activity: Activity,
}

#[async_std::main]
async fn main() -> tide::Result<()> {
    let url = dotenvy::var("DATABASE_URL")?;
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let mut app = tide::with_state(pool);

    app.at("/activity/create")
        .post(endpoints::activity::create_activity);
    app.at("/activity/get")
        .post(endpoints::activity::get_activity);
    app.at("/activity/count")
        .get(endpoints::activity::get_activity_count);

    app.at("/user/create").post(endpoints::user::create_user);
    app.at("/user/delete").delete(endpoints::user::delete_user);
    app.at("/user/getAll").post(endpoints::user::get_all_users);
    app.at("/user/count").get(endpoints::user::get_user_count);

    app.at("/expense/create")
        .post(endpoints::expense::create_expense);
    app.at("/expense/getAll")
        .post(endpoints::expense::get_all_expenses);
    app.at("/expense/count")
        .get(endpoints::expense::get_expense_count);

    println!("Server running on port 8000");

    let listen_url = dotenvy::var("LISTEN_URL")?;
    app.listen(&listen_url).await?;
    Ok(())
}
