use std::error::Error;

use sqlx::Row;
use tide::{Request, Response};

use crate::{endpoints::create_id, Activity};

pub async fn create_activity(request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "INSERT INTO activities (id) VALUES ($1)";

    let id: String = create_unique_activity_id(request.state()).await;

    let _ = sqlx::query(query).bind(&id).execute(request.state()).await;

    let query = "SELECT * FROM activities WHERE id = $1";

    let row = sqlx::query(query)
        .bind(&id)
        .fetch_one(request.state())
        .await
        .expect("failed to create activity");

    let activity = Activity { id: row.get("id") };

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&activity)?)
        .build())
}

pub async fn get_activity(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let activity = request.body_json::<Activity>().await?;

    let activity = get_activity_by_id(&activity.id, request.state())
        .await
        .expect("failed to get activity");

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&activity)?)
        .build())
}

pub async fn get_activity_by_id(
    id: &String,
    pool: &sqlx::PgPool,
) -> Result<Activity, Box<dyn Error>> {
    let query = "SELECT * FROM activities WHERE id = $1";

    let row = sqlx::query(query).bind(id).fetch_one(pool).await?;

    let activity = Activity { id: row.get("id") };

    Ok(activity)
}

pub async fn get_activity_count(request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "SELECT COUNT(*) FROM activities";

    let row = sqlx::query(query).fetch_one(request.state()).await?;

    let amount = row.get::<i64, usize>(0);

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&amount)?)
        .build())
}

async fn create_unique_activity_id(pool: &sqlx::PgPool) -> String {
    let query = "SELECT * FROM activities WHERE id = $1";

    loop {
        let id = create_id(15);

        let row = sqlx::query(query)
            .bind(&id)
            .fetch_optional(pool)
            .await
            .expect("failed to get activity");

        if row.is_none() {
            return id;
        }

        println!("id already exists, trying again")
    }
}
