use sqlx::Row;
use tide::{Request, Response};

use crate::User;

use super::activity;

pub async fn create_user(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "INSERT INTO users (name, activity) VALUES ($1, $2)";

    let user = request
        .body_json::<User>()
        .await
        .expect("failed to parse user");

    let _ = sqlx::query(query)
        .bind(&user.name)
        .bind(user.activity.id)
        .execute(request.state())
        .await
        .expect("failed to create user");

    let query = "SELECT * FROM users WHERE name = $1 AND activity = $2";

    let row = sqlx::query(query)
        .bind(&user.name)
        .bind(user.activity.id)
        .fetch_one(request.state())
        .await
        .unwrap();

    let activity = activity::get_activity(user.activity.id, request.state())
        .await
        .expect("failed to get activity");

    let user = User {
        name: row.get("name"),
        activity: activity,
    };

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&user)?)
        .build())
}
