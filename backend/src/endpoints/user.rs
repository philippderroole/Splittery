use sqlx::Row;
use tide::{Request, Response};

use crate::{
    database::{self, user::get_user_by_id},
    dtos::UserDto,
    entities::{Metadata, User},
};

pub async fn get_user(request: Request<sqlx::PgPool>) -> tide::Result {
    let pool = request.state().clone();

    let user_id: String = request.param("user_id")?.parse().unwrap();

    let user = database::user::get_user_by_id(&user_id, pool.clone()).await;

    match user {
        Ok(user) => {
            return Ok(Response::builder(200)
                .body(tide::Body::from_json(&user)?)
                .build())
        }
        Err(err) => return Ok(Response::builder(500).body(err.to_string()).build()),
    };
}

pub async fn post_user(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let pool = request.state().clone();

    let user = request
        .body_json::<UserDto>()
        .await
        .expect("Received invalid user");

    let user_id = database::user::create_unique_user_id(pool.clone()).await;

    let user_name = match user.name {
        Some(name) => name,
        None => {
            return Ok(Response::builder(500)
                .body("Cannot create user without a name".to_string())
                .build());
        }
    };

    let now = chrono::Utc::now();

    let metadata = Metadata {
        created_at: now,
        updated_at: now,
        deleted_at: None,
        is_deleted: false,
    };

    let user = User {
        id: user_id.clone(),
        name: user_name,
        metadata: metadata,
        activity_ids: user.activity_ids,
    };

    let result = database::user::insert_user(user, pool.clone()).await;
    if result.is_err() {
        return Ok(Response::builder(500)
            .body(result.unwrap_err().to_string())
            .build());
    }

    let user = get_user_by_id(&user_id, pool).await;

    match user {
        Ok(user) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&user)?)
            .build()),
        Err(err) => Ok(Response::builder(500).body(err.to_string()).build()),
    }
}

pub async fn put_user(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let pool = request.state().clone();

    let user = request
        .body_json::<UserDto>()
        .await
        .expect("Received invalid user");

    let user_id = match &user.id {
        Some(id) => id,
        None => {
            return Ok(Response::builder(500)
                .body("Cannot update user without an id".to_string())
                .build());
        }
    };

    let user = todo!();

    let result = database::user::update_user(&user, &request).await;

    if result.is_err() {
        return Ok(Response::builder(500)
            .body(result.unwrap_err().to_string())
            .build());
    }

    let user = database::user::get_user_by_id(&user_id, pool.clone()).await;

    match user {
        Ok(user) => Ok(Response::builder(200)
            .body(tide::Body::from_json(&user)?)
            .build()),
        Err(_) => Ok(Response::builder(500).build()),
    }
}

pub async fn delete_user(mut request: Request<sqlx::PgPool>) -> tide::Result {
    let user = request
        .body_json::<User>()
        .await
        .expect("Received invalid user");

    let result = database::user::delete_user(&user, &request).await;

    match result {
        Ok(_) => Ok(Response::builder(200).build()),
        Err(err) => Ok(Response::builder(500).body(err.to_string()).build()),
    }
}

pub async fn get_user_count(request: Request<sqlx::PgPool>) -> tide::Result {
    let query = "SELECT COUNT(*) FROM users WHERE deleted_at NOT NULL";

    let row = sqlx::query(query)
        .fetch_one(request.state())
        .await
        .expect("Failed to count the number of users");

    let amount = row.get::<i64, usize>(0);

    Ok(Response::builder(200)
        .body(tide::Body::from_json(&amount)?)
        .build())
}
