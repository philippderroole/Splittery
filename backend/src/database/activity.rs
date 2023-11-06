use std::error::Error;

use sqlx::Row;

use crate::{
    database::create_id,
    entities::{Activity, Metadata},
};

use super::{expense::get_expenses_by_activity_id, user::get_user_ids_by_activity_id};

pub async fn get_activity_ids_by_user_id(user_id: &String, pool: &sqlx::PgPool) -> Vec<String> {
    let query = "SELECT * FROM users_activities WHERE user_id = $1";

    let rows = sqlx::query(query)
        .bind(&user_id)
        .fetch_all(pool)
        .await
        .expect("failed to get activities");

    rows.iter().map(|row| row.get("activity_id")).collect()
}

pub async fn create_unique_activity_id(pool: &sqlx::PgPool) -> String {
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

pub async fn get_activity_by_id(
    id: &String,
    pool: &sqlx::PgPool,
) -> Result<Activity, Box<dyn Error>> {
    let query = "SELECT * FROM activities WHERE id = $1";

    let row = sqlx::query(query).bind(id).fetch_one(pool).await?;

    let activity = parse_activity(row, pool).await;

    Ok(activity)
}

async fn parse_activity(row: sqlx::postgres::PgRow, pool: &sqlx::Pool<sqlx::Postgres>) -> Activity {
    let activity_id = row.get("id");

    let metadata = Metadata {
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        deleted_at: row.get("deleted_at"),
        is_deleted: row.get("is_deleted"),
    };

    let user_ids = get_user_ids_by_activity_id(&activity_id, pool).await;
    let expenses = get_expenses_by_activity_id(&activity_id, pool).await;

    let activity = Activity {
        id: Some(activity_id),
        metadata: Some(metadata),
        user_ids: Some(user_ids),
        expenses: Some(expenses),
    };
    activity
}

pub async fn get_activities_by_user_id(
    user_id: &String,
    pool: &sqlx::PgPool,
) -> Result<Vec<Activity>, Box<dyn Error>> {
    let query = "SELECT * FROM users_activities WHERE user_id = $1";

    let rows = sqlx::query(query).bind(&user_id).fetch_all(pool).await?;

    let mut activities = Vec::new();

    for row in rows {
        let activity = get_activity_by_id(&row.get("activity_id"), pool)
            .await
            .expect("failed to get activity");
        activities.push(activity);
    }

    Ok(activities)
}

pub async fn get_activities_by_ids(ids: &Vec<String>, pool: &sqlx::PgPool) -> Vec<Activity> {
    let query = "SELECT * FROM activities WHERE id = ANY($1)";

    let rows = sqlx::query(query)
        .bind(ids)
        .fetch_all(pool)
        .await
        .expect("failed to get activities");

    let mut activities = Vec::new();

    for row in rows {
        let activity = parse_activity(row, pool).await;
        activities.push(activity);
    }

    activities
}
