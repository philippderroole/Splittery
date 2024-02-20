use actix_web::{delete, get, http::header::ContentType, post, put, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct Transaction {
    id: i32,
    name: String,
    amount: f64,
    user_id: i32,
}

#[get("/splits/{split_id}/transactions/{transaction_id}")]
pub async fn get(pool: web::Data<Pool<Postgres>>, path: web::Path<(i32, i32)>) -> impl Responder {
    let (split_id, transaction_id) = path.into_inner();

    let row = sqlx::query!(
        "
        SELECT *
        FROM transaction
        WHERE id = $1 AND split_id = $2
        ",
        transaction_id,
        split_id
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let transaction = Transaction {
        id: row.id,
        name: row.name.clone(),
        amount: row.amount as f64,
        user_id: row.user_id,
    };

    let body = serde_json::to_string(&transaction).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[derive(Deserialize)]
struct TransactionQuery {
    user_id: Option<i32>,
}

#[get("/splits/{split_id}/transactions")]
pub async fn get_multiple(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<i32>,
    query: web::Query<TransactionQuery>,
) -> impl Responder {
    let split_id = path.into_inner();
    let user_id = query.user_id;

    let transactions = match user_id {
        Some(user_id) => {
            let rows = sqlx::query!(
                "
                SELECT *
                FROM transaction
                WHERE user_id = $1 AND split_id = $2
                ",
                user_id,
                split_id
            )
            .fetch_all(pool.get_ref())
            .await
            .unwrap();

            rows.iter()
                .map(|row| Transaction {
                    id: row.id,
                    name: row.name.clone(),
                    amount: row.amount as f64,
                    user_id: row.user_id,
                })
                .collect::<Vec<Transaction>>()
        }
        None => {
            let rows = sqlx::query!(
                "
                SELECT *
                FROM transaction
                WHERE split_id = $1
                ",
                split_id
            )
            .fetch_all(pool.get_ref())
            .await
            .unwrap();

            rows.iter()
                .map(|row| Transaction {
                    id: row.id,
                    name: row.name.clone(),
                    amount: row.amount as f64,
                    user_id: row.user_id,
                })
                .collect::<Vec<Transaction>>()
        }
    };

    let body = serde_json::to_string(&transactions).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[derive(Deserialize)]
struct TransactionDto {
    name: String,
    amount: f64,
    user_id: i32,
}

#[post("/splits/{split_id}/transactions")]
pub async fn post(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<i32>,
    body: web::Json<TransactionDto>,
) -> impl Responder {
    let split_id = path.into_inner();
    let transaction = body.into_inner();

    let row = sqlx::query!(
        "
        INSERT INTO transaction (name, amount, user_id, split_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        ",
        transaction.name,
        transaction.amount as f32,
        transaction.user_id,
        split_id
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let transaction = Transaction {
        id: row.id,
        name: row.name.clone(),
        amount: row.amount as f64,
        user_id: row.user_id,
    };

    let body = serde_json::to_string(&transaction).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[put("/splits/{split_id}/transactions/{transaction_id}")]
pub async fn put(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(i32, i32)>,
    body: web::Json<TransactionDto>,
) -> impl Responder {
    let (split_id, transaction_id) = path.into_inner();
    let transaction = body.into_inner();

    let row = sqlx::query!(
        "
        UPDATE transaction
        SET name = $1, amount = $2, user_id = $3
        WHERE id = $4 AND split_id = $5
        RETURNING *
        ",
        transaction.name,
        transaction.amount as f32,
        transaction.user_id,
        transaction_id,
        split_id
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let transaction = Transaction {
        id: row.id,
        name: row.name.clone(),
        amount: row.amount as f64,
        user_id: row.user_id,
    };

    let body = serde_json::to_string(&transaction).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[delete("/splits/{split_id}/transactions/{transaction_id}")]
pub async fn delete(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(i32, i32)>,
) -> impl Responder {
    let (split_id, transaction_id) = path.into_inner();

    sqlx::query!(
        "
        DELETE FROM transaction
        WHERE id = $1 AND split_id = $2
        ",
        transaction_id,
        split_id
    )
    .execute(pool.get_ref())
    .await
    .unwrap();

    HttpResponse::Ok()
}
