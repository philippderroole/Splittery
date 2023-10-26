use sqlx::Row;
use tide::{Request, Response};

use crate::{Activity, User};

use super::activity;

pub async fn create_user(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "INSERT INTO users (name, activity_id) VALUES ($1, $2)";

    let user = request
        .body_json::<User>()
        .await
        .expect("failed to parse user");

    let _ = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.activity.id)
        .execute(request.state())
        .await
        .expect("failed to create user");

    let query = "SELECT * FROM users WHERE name = $1 AND activity_id = $2";

    let row = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.activity.id)
        .fetch_one(request.state())
        .await
        .unwrap();

    let activity = activity::get_activity_by_id(&user.activity.id, request.state())
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

pub async fn delete_user(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "DELETE FROM users WHERE activity_id = $1 AND name = $2";

    let user = request
        .body_json::<User>()
        .await
        .expect("failed to parse user");

    let _ = sqlx::query(query)
        .bind(user.activity.id)
        .bind(user.name)
        .execute(request.state())
        .await
        .expect("failed to delete user");

    Ok(Response::builder(200).build())
}

pub async fn get_all_users(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "SELECT * FROM users WHERE activity_id = $1";

    let activity = request
        .body_json::<Activity>()
        .await
        .expect("failed to parse activity");

    let rows = sqlx::query(query)
        .bind(&activity.id)
        .fetch_all(request.state())
        .await
        .expect("failed to get users");

    let users = rows
        .iter()
        .map(|row| User {
            name: row.get("name"),
            activity: activity.clone(),
        })
        .collect::<Vec<User>>();

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&users)?)
        .build())
}
