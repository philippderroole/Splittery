#![feature(proc_macro_hygiene, decl_macro)]

use tide::http::headers::HeaderValue;
use tide::security::CorsMiddleware;
use tide::security::Origin;

mod database;
mod endpoints;
pub mod entities;

#[async_std::main]
async fn main() -> tide::Result<()> {
    let url = dotenvy::var("DATABASE_URL")?;
    let pool = sqlx::postgres::PgPool::connect(&url).await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    let mut app = tide::with_state(pool);

    #[cfg(feature = "allow-cors")]
    {
        let cors = CorsMiddleware::new()
            .allow_methods("GET, POST, PUT, DELETE".parse::<HeaderValue>().unwrap())
            .allow_origin(Origin::from("*"))
            .allow_credentials(false);

        app.with(cors);
    }

    app.at("/activity/:id")
        .get(endpoints::activity::get_activity);
    app.at("/activity").post(endpoints::activity::post_activity);
    app.at("/activity").put(endpoints::activity::put_activity);
    app.at("/activity")
        .delete(endpoints::activity::delete_activity);
    app.at("/activity/count")
        .get(endpoints::activity::get_activity_count);

    app.at("/user/:id").get(endpoints::user::get_user);
    app.at("/user").post(endpoints::user::post_user);
    app.at("/user").put(endpoints::user::put_user);
    app.at("/user").delete(endpoints::user::delete_user);
    app.at("/user/count").get(endpoints::user::get_user_count);

    app.at("/expense/:id").get(endpoints::expense::get_expense);
    app.at("/expense").post(endpoints::expense::post_expense);
    app.at("/expense").put(endpoints::expense::put_expense);
    app.at("/expense")
        .delete(endpoints::expense::delete_expense);
    app.at("/expense/count")
        .get(endpoints::expense::get_expense_count);

    app.at("/expenses/:activity_id")
        .get(endpoints::expense::get_expenses_by_activity_id);

    println!("Server running on port 8000");

    let listen_url = dotenvy::var("LISTEN_URL")?;
    app.listen(&listen_url).await?;
    Ok(())
}
