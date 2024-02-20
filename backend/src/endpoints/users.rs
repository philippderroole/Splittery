use actix_web::{delete, get, http::header::ContentType, post, put, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct User {
    id: i32,
    name: String,
}

#[get("/splits/{split_id}/users/{user_id}")]
pub async fn get(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(String, i32)>,
) -> impl Responder {
    let (split_id, user_id) = path.into_inner();

    let rows = sqlx::query!(
        "
        SELECT *
        FROM \"user\"
        WHERE id = $1 AND split_id = $2
        ",
        user_id,
        split_id
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let user = User {
        id: rows.id,
        name: rows.name.clone(),
    };

    let body = serde_json::to_string(&user).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[get("/splits/{split_id}/users")]
pub async fn get_multiple(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<String>,
) -> impl Responder {
    let split_id = path.into_inner();

    let rows = sqlx::query!(
        "
        SELECT *
        FROM \"user\"
        WHERE split_id = $1
        ",
        split_id
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap();

    let users: Vec<User> = rows
        .iter()
        .map(|row| User {
            id: row.id,
            name: row.name.clone(),
        })
        .collect();

    let body = serde_json::to_string(&users).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[derive(Deserialize)]
pub struct UserDto {
    name: String,
}

#[post("/splits/{split_id}/users")]
pub async fn post(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<String>,
    user: web::Json<UserDto>,
) -> impl Responder {
    let split_id = path.into_inner();

    let rows = sqlx::query!(
        "
        INSERT INTO \"user\" (split_id, name)
        VALUES ($1, $2)
        RETURNING *
        ",
        split_id,
        user.name
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let user = User {
        id: rows.id,
        name: rows.name.clone(),
    };

    let body = serde_json::to_string(&user).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[put("/splits/{split_id}/users/{user_id}")]
pub async fn put(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(String, i32)>,
    user: web::Json<UserDto>,
) -> impl Responder {
    let (split_id, user_id) = path.into_inner();

    let rows = sqlx::query!(
        "
        UPDATE \"user\"
        SET name = $1
        WHERE id = $2 AND split_id = $3
        RETURNING *
        ",
        user.name,
        user_id,
        split_id
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let user = User {
        id: rows.id,
        name: rows.name.clone(),
    };

    let body = serde_json::to_string(&user).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[delete("/splits/{split_id}/users/{user_id}")]
pub async fn delete(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(String, i32)>,
) -> impl Responder {
    let (split_id, user_id) = path.into_inner();

    sqlx::query!(
        "
        DELETE FROM \"user\"
        WHERE id = $1 AND split_id = $2
        ",
        user_id,
        split_id
    )
    .execute(pool.get_ref())
    .await
    .unwrap();

    HttpResponse::Ok()
}
