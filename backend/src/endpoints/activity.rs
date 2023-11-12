use sqlx::Row;
use tide::{Request, Response};

use crate::{
    database::{
        self,
        activity::{create_unique_activity_id, get_activity_by_id},
    },
    dtos::ActivityDto,
    entities::{Activity, Metadata},
};

pub async fn get_activity(request: Request<sqlx::PgPool>) -> tide::Result {
    let id = request.param("id")?.parse().unwrap();

    let activity = database::activity::get_activity_by_id(&id, &request).await;

    match activity {
        Ok(activity) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&activity)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn post_activity(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let pool = request.state().clone();

    let activity_dto = request.body_json::<ActivityDto>().await?;

    let id: String = create_unique_activity_id(&request).await;

    let now = chrono::Utc::now();

    let metadata = Metadata {
        created_at: now,
        updated_at: now,
        deleted_at: None,
        is_deleted: false,
    };

    let activity = Activity {
        id: id,
        metadata: metadata,
        user_ids: activity_dto.user_ids.unwrap_or(Vec::new()),
        expense_ids: activity_dto.expense_ids.unwrap_or(Vec::new()),
    };

    let result = database::activity::insert_activity(&activity, &pool).await;

    if result.is_err() {
        return Ok(Response::builder(500)
            .body(format!(
                "Failed to create activity: {}",
                result.unwrap_err().to_string()
            ))
            .build());
    }

    let activity = database::activity::get_activity_by_id(&activity.id, &pool).await;

    match activity {
        Ok(activity) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&activity)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn put_activity(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let activity_dto = request.body_json::<ActivityDto>().await?;

    let activity = Activity {
        id: todo!(),
        metadata: todo!(),
        user_ids: todo!(),
        expense_ids: todo!(),
    };

    let result = database::activity::update_activity(&activity, request).await;

    if result.is_err() {
        return Ok(Response::builder(500)
            .body(format!(
                "Failed to update activity: {}",
                result.unwrap_err()
            ))
            .build());
    }

    let activity = get_activity_by_id(&activity.id, &request).await;

    match activity {
        Ok(activity) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&activity)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn delete_activity(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let activity = request.body_json::<ActivityDto>().await?;

    let activity_id = match &activity.id {
        Some(id) => id,
        None => {
            return Ok(Response::builder(500)
                .body(format!("Cannot delete activity without an id"))
                .build())
        }
    };

    let result = database::activity::delete_activity(activity_id, request).await;

    match result {
        Ok(_) => Ok(Response::builder(200).build()),
        Err(err) => Ok(Response::builder(500).body(err.to_string()).build()),
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
