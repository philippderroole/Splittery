use std::error::Error;

use sqlx::Row;
use tide::Request;

use crate::{
    database::create_id,
    entities::{Activity, Metadata, User},
};

use super::{
    activity::{self, get_activity_ids_by_user_id},
    user_activity,
};

pub async fn get_user_by_id(id: &String, pool: sqlx::PgPool) -> Result<User, Box<dyn Error>> {
    let query = "SELECT * FROM users WHERE id = $1";

    let row = sqlx::query(query).bind(&id).fetch_one(pool).await;

    let row = match row {
        Ok(row) => row,
        Err(err) => return Err(err.into()),
    };

    let metadata = Metadata {
        created_at: row.get("created_at"),
        updated_at: row.get("updated_at"),
        deleted_at: row.get("deleted_at"),
        is_deleted: row.get("is_deleted"),
    };

    let activity_ids = get_activity_ids_by_user_id(id, pool).await;

    Ok(User {
        metadata: metadata,
        id: row.get("id"),
        name: row.get("name"),
        activity_ids: Some(activity_ids),
    })
}

pub async fn get_user_ids_by_activity_id(
    activity_id: &String,
    request: &Request<sqlx::PgPool>,
) -> Vec<String> {
    let query = "SELECT * FROM users_activities WHERE activity_id = $1";

    let rows = sqlx::query(query)
        .bind(&activity_id)
        .fetch_all(request.state())
        .await
        .expect("failed to get activities_users");

    rows.iter()
        .map(|row| row.get("user_id"))
        .collect::<Vec<String>>()
}

pub async fn create_unique_user_id(pool: sqlx::PgPool) -> String {
    loop {
        let id = create_id(15);

        let user = get_user_by_id(&id, pool.clone()).await;

        if user.is_err() {
            return id;
        }

        println!("id already exists, trying again")
    }
}

pub async fn insert_user(user: User, pool: sqlx::PgPool) -> Result<(), Box<dyn Error>> {
    let query = "INSERT INTO users (created_at, updated_at, deleted_at, is_deleted, id, name) VALUES ($1, $2, $3, $4, $5)";

    let _ = sqlx::query(query)
        .bind(chrono::Utc::now())
        .bind(chrono::Utc::now())
        .bind(None::<chrono::DateTime<chrono::Utc>>)
        .bind(false)
        .bind(&user.id)
        .bind(&user.name)
        .execute(&pool)
        .await
        .expect("Failed to insert user into database");

    let result = user_activity::add_user_to_activities(&user, &Vec::new(), pool).await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.into()),
    }
}

pub async fn update_user(
    user: &User,
    request: &Request<sqlx::PgPool>,
) -> Result<(), Box<dyn Error>> {
    let query = "UPDATE users SET is_deleted = $1, name = $2 WHERE id = $3";

    let _ = sqlx::query(query)
        .bind(&user.name)
        .bind(&user.id)
        .execute(request.state())
        .await
        .expect("failed to update user");

    let new_activities = match &user.activity_ids {
        Some(activity_ids) => activity::get_activities_by_ids(activity_ids, request).await,
        None => Vec::new(),
    };

    let saved_activities = activity::get_activities_by_user_id(&user.id, request)
        .await
        .unwrap();

    let added_activities = new_activities
        .iter()
        .filter(|a| !saved_activities.contains(a))
        .collect::<Vec<&Activity>>();

    todo!();

    Ok(())
}

pub async fn delete_user(
    user: &User,
    request: &Request<sqlx::PgPool>,
) -> Result<(), Box<dyn Error>> {
    let user_activity_ids = user.activity_ids.as_ref();

    if user_activity_ids.is_some() {
        let user_activity_ids = user_activity_ids.unwrap();

        let activities = activity::get_activities_by_ids(&user_activity_ids, request).await;

        let result = user_activity::delete_user_from_activities(&user, &activities, request).await;

        if result.is_err() {
            return Err(result.unwrap_err());
        }
    }

    let query = "DELETE FROM users WHERE id = $1";

    let result = sqlx::query(query)
        .bind(true)
        .bind(&user.id)
        .execute(request.state())
        .await;

    match result {
        Ok(_) => Ok(()),
        Err(err) => Err(err.into()),
    }
}
