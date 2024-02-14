use actix_web::{get, http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct Split {
    id: i32,
    name: String,
}

#[get("/splits/{split_id}")]
pub async fn get(pool: web::Data<Pool<Postgres>>, path: web::Path<i32>) -> impl Responder {
    let split_id = path.into_inner();

    let rows = sqlx::query!("SELECT * FROM \"split\" WHERE \"id\" = $1", split_id)
        .fetch_one(pool.get_ref())
        .await
        .unwrap();

    let split = Split {
        id: rows.id,
        name: rows.name.clone(),
    };

    let body = serde_json::to_string(&split).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[derive(Deserialize)]
pub struct SplitDto {
    name: String,
}

#[post("/splits")]
pub async fn post(pool: web::Data<Pool<Postgres>>, body: web::Json<SplitDto>) -> impl Responder {
    let split = body.into_inner();

    let row = sqlx::query!(
        "
        INSERT INTO \"split\" (\"name\")
        VALUES ($1)
        RETURNING *
        ",
        split.name
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let split = Split {
        id: row.id,
        name: row.name.clone(),
    };

    let body = serde_json::to_string(&split).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}