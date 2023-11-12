use std::error::Error;

use sqlx::{pool, Row};
use tide::Request;

use crate::{
    database::create_id,
    entities::{Activity, Metadata},
};

use super::{expense, user};

pub async fn get_activity_ids_by_user_id(
    user_id: &String,
    request: &Request<sqlx::PgPool>,
) -> Vec<String> {
    let query = "SELECT * FROM users_activities WHERE user_id = $1";

    let rows = sqlx::query(query)
        .bind(&user_id)
        .fetch_all(request.state())
        .await
        .expect("failed to get activities");

    rows.iter().map(|row| row.get("activity_id")).collect()
}

pub async fn create_unique_activity_id(request: &Request<sqlx::PgPool>) -> String {
    let query = "SELECT * FROM activities WHERE id = $1";

    loop {
        let id = create_id(15);

        let row = sqlx::query(query)
            .bind(&id)
            .fetch_optional(request.state())
            .await
            .expect("failed to get activity");

        if row.is_none() {
            return id;
        }

        println!("id already exists, trying again")
    }
}

pub async fn get_activity_by_id(
    id: &String,
    request: &Request<sqlx::PgPool>,
) -> Result<Activity, Box<dyn Error>> {
    let query = "SELECT * FROM activities WHERE id = $1";

    let row = sqlx::query(query)
        .bind(id)
        .fetch_one(request.state())
        .await?;

    parse_activity(row, &request).await
}

async fn parse_activity(
    row: sqlx::postgres::PgRow,
    request: &Request<sqlx::PgPool>,
) -> Result<Activity, Box<dyn Error>> {
    let activity_id = row.get("id");

    let metadata = Metadata {
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        deleted_at: row.get("deleted_at"),
        is_deleted: row.get("is_deleted"),
    };

    let user_ids = user::get_user_ids_by_activity_id(&activity_id, &request).await;
    let expense_ids = expense::get_expense_ids_by_activity_id(&activity_id, request).await;

    let expense_ids = match expense_ids {
        Ok(expense_ids) => expense_ids,
        Err(err) => return Err(err.into()),
    };

    let activity = Activity {
        id: activity_id,
        metadata: metadata,
        user_ids: user_ids,
        expense_ids: expense_ids,
    };

    Ok(activity)
}

pub async fn get_activities_by_user_id(
    user_id: &String,
    request: &Request<sqlx::PgPool>,
) -> Result<Vec<Activity>, Box<dyn Error>> {
    let query = "SELECT * FROM users_activities WHERE user_id = $1";

    let rows = sqlx::query(query)
        .bind(&user_id)
        .fetch_all(request.state())
        .await?;

    let mut activities = Vec::new();

    for row in rows {
        let activity = get_activity_by_id(&row.get("activity_id"), request)
            .await
            .expect("failed to get activity");
        activities.push(activity);
    }

    Ok(activities)
}

pub async fn get_activities_by_ids(
    ids: &Vec<String>,
    request: &Request<sqlx::PgPool>,
) -> Vec<Activity> {
    let query = "SELECT * FROM activities WHERE id = ANY($1)";

    let rows = sqlx::query(query)
        .bind(ids)
        .fetch_all(request.state())
        .await
        .expect("failed to get activities");

    let mut activities = Vec::new();

    for row in rows {
        let activity = parse_activity(row, request).await.unwrap();
        activities.push(activity);
    }

    activities
}

pub async fn insert_activity(
    activity: &Activity,
    pool: &sqlx::PgPool,
) -> Result<(), Box<dyn Error>> {
    let query =
        "INSERT INTO activities (created_at, updated_at, deleted_at, id) VALUES ($1, $2, $3, $4)";

    let _ = sqlx::query(query)
        .bind(&activity.metadata.created_at)
        .bind(&activity.metadata.updated_at)
        .bind(&activity.metadata.deleted_at)
        .bind(&activity.id)
        .execute(pool)
        .await;

    Ok(())
}

pub async fn delete_activity(
    activity_id: &String,
    request: Request<sqlx::PgPool>,
) -> Result<(), Box<dyn Error>> {
    let query = "DELETE FROM activities WHERE id = $1";

    let _ = sqlx::query(query)
        .bind(&activity_id)
        .execute(request.state())
        .await?;

    Ok(())
}

pub async fn update_activity(
    activity: &Activity,
    request: Request<sqlx::PgPool>,
) -> Result<(), Box<dyn Error>> {
    let query = "UPDATE activities SET updated_at = $1 WHERE id = $2";

    let _ = sqlx::query(query)
        .bind(&activity.metadata.updated_at)
        .bind(&activity.id)
        .execute(request.state())
        .await?;

    Ok(())
}
