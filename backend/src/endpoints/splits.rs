use actix_web::{get, http::header::ContentType, post, put, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct Split {
    id: String,
    name: String,
}

#[get("/splits/{split_id}")]
pub async fn get(pool: web::Data<Pool<Postgres>>, path: web::Path<String>) -> impl Responder {
    let split_id = path.into_inner();

    let query = sqlx::query!("SELECT * FROM \"split\" WHERE \"id\" = $1", split_id)
        .fetch_one(pool.get_ref());

    let rows = match query.await {
        Ok(rows) => rows,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let split = Split {
        id: rows.id,
        name: rows.name.clone(),
    };

    let body = serde_json::to_string(&split).expect("Failed to serialize split");

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

    let query = sqlx::query!(
        "
        INSERT INTO \"split\" (\"name\")
        VALUES ($1)
        RETURNING *
        ",
        split.name
    )
    .fetch_one(pool.get_ref());

    let row = match query.await {
        Ok(row) => row,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let split = Split {
        id: row.id.clone(),
        name: row.name.clone(),
    };

    let body = serde_json::to_string(&split).expect("Failed to serialize split");

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[put("/splits/{split_id}")]
pub async fn put(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<String>,
    body: web::Json<SplitDto>,
) -> impl Responder {
    let split_id = path.into_inner();
    let split = body.into_inner();

    let query = sqlx::query!(
        "
        UPDATE \"split\"
        SET \"name\" = $1
        WHERE \"id\" = $2
        RETURNING *
        ",
        split.name,
        split_id
    )
    .fetch_one(pool.get_ref());

    let row = match query.await {
        Ok(row) => row,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let split = Split {
        id: row.id,
        name: row.name.clone(),
    };

    let body = serde_json::to_string(&split).expect("Failed to serialize split");

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}
