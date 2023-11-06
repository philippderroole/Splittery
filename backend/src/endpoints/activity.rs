use sqlx::Row;
use tide::{Request, Response};

use crate::{
    database::activity::{create_unique_activity_id, get_activity_by_id},
    entities::{Activity, Metadata},
};

pub async fn get_activity(request: Request<sqlx::PgPool>) -> tide::Result {
    let id = request.param("id")?.parse().unwrap();

    let activity = get_activity_by_id(&id, request.state()).await;

    match activity {
        Ok(activity) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&activity)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn post_activity(request: Request<sqlx::PgPool>) -> tide::Result {
    let id: String = create_unique_activity_id(request.state()).await;

    let metadata = Metadata {
        created_at: Some(chrono::Utc::now()),
        updated_at: Some(chrono::Utc::now()),
        deleted_at: None,
        is_deleted: Some(false),
    };

    let activity = Activity {
        id: Some(id.clone()),
        metadata: Some(metadata),
        user_ids: Some(Vec::new()),
        expenses: Some(Vec::new()),
    };

    let query =
        "INSERT INTO activities (created_at, updated_at, deleted_at, id) VALUES ($1, $2, $3, $4)";

    let _ = sqlx::query(query)
        .bind(&activity.metadata.created_at)
        .bind(&activity.metadata.updated_at)
        .bind(&activity.metadata.deleted_at)
        .bind(&activity.id)
        .execute(request.state())
        .await;

    let activity = get_activity_by_id(&activity.id, request.state()).await;

    match activity {
        Ok(activity) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&activity)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn put_activity(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let activity = request.body_json::<Activity>().await?;

    let query = "UPDATE activities SET updated_at = $1, deleted_at = $2 WHERE id = $3";

    let result = sqlx::query(query)
        .bind(chrono::Utc::now())
        .bind(&activity.metadata.deleted_at)
        .bind(&activity.id)
        .execute(request.state())
        .await;

    if result.is_err() {
        return Ok(Response::builder(500).build());
    }

    let activity = get_activity_by_id(&activity.id, request.state()).await;

    match activity {
        Ok(activity) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&activity)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn delete_activity(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let activity = request.body_json::<Activity>().await?;

    let query = "DELETE FROM activities WHERE id = $1";

    let result = sqlx::query(query)
        .bind(&activity.id)
        .execute(request.state())
        .await;

    match result {
        Ok(_) => Ok(Response::builder(200).build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn get_activity_count(request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "SELECT COUNT(*) FROM activities";

    let row = sqlx::query(query).fetch_one(request.state()).await?;

    let amount = row.get::<i64, usize>(0);

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&amount)?)
        .build())
}
