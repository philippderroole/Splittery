use actix_web::{get, http::header::ContentType, web, HttpResponse, Responder};
use serde::Serialize;
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct User {
    id: i32,
    name: String,
}

#[get("/splits/{split_id}/users/{user_id}")]
pub async fn get(pool: web::Data<Pool<Postgres>>, path: web::Path<(i32, i32)>) -> impl Responder {
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
pub async fn get_multiple(pool: web::Data<Pool<Postgres>>, path: web::Path<i32>) -> impl Responder {
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
