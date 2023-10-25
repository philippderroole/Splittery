use std::error::Error;

use rand::{distributions::Alphanumeric, Rng};
use sqlx::Row;
use tide::{Request, Response};

use crate::Activity;

pub async fn create_activity(request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "INSERT INTO activities (id) VALUES ($1)";

    let id: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(63)
        .map(char::from)
        .collect();

    let _ = sqlx::query(query).bind(&id).execute(request.state()).await;

    let query = "SELECT * FROM activities WHERE id = $1";

    let row = sqlx::query(query)
        .bind(&id)
        .fetch_one(request.state())
        .await
        .expect("failed to create activity");

    let activity = Activity {
        id: row.get("id"),
        expenses: Vec::new(),
        users: Vec::new(),
    };

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&activity)?)
        .build())
}

pub async fn get_activity(id: &String, pool: &sqlx::PgPool) -> Result<Activity, Box<dyn Error>> {
    let query = "SELECT * FROM activities WHERE id = $1";

    let row = sqlx::query(query).bind(id).fetch_one(pool).await?;

    let activity = Activity {
        id: row.get("id"),
        expenses: Vec::new(),
        users: Vec::new(),
    };

    Ok(activity)
}
