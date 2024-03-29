use actix_web::{delete, get, http::header::ContentType, post, put, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct Transaction {
    id: i32,
    title: String,
    description: Option<String>,
    amount: f64,
    user_id: i32,
}

#[get("/splits/{split_id}/transactions/{transaction_id}")]
pub async fn get(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(String, i32)>,
) -> impl Responder {
    let (split_id, transaction_id) = path.into_inner();

    let query = sqlx::query!(
        "
        SELECT *
        FROM transaction
        WHERE id = $1 AND split_id = $2
        ",
        transaction_id,
        split_id
    )
    .fetch_one(pool.get_ref());

    let row = match query.await {
        Ok(row) => row,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let transaction = Transaction {
        id: row.id,
        title: row.title.clone(),
        description: row.description.clone(),
        amount: row.amount as f64,
        user_id: row.user_id,
    };

    let body = serde_json::to_string(&transaction).expect("Failed to serialize transaction");

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
    path: web::Path<String>,
    query: web::Query<TransactionQuery>,
) -> impl Responder {
    let split_id = path.into_inner();
    let user_id = query.user_id;

    let transactions = match user_id {
        Some(user_id) => {
            let query = sqlx::query!(
                "
                SELECT *
                FROM transaction
                WHERE user_id = $1 AND split_id = $2
                ",
                user_id,
                split_id
            )
            .fetch_all(pool.get_ref());

            let rows = match query.await {
                Ok(rows) => rows,
                Err(_) => return HttpResponse::InternalServerError().finish(),
            };

            rows.iter()
                .map(|row| Transaction {
                    id: row.id,
                    title: row.title.clone(),
                    description: row.description.clone(),
                    amount: row.amount,
                    user_id: row.user_id,
                })
                .collect::<Vec<Transaction>>()
        }
        None => {
            let query = sqlx::query!(
                "
                SELECT *
                FROM transaction
                WHERE split_id = $1
                ",
                split_id
            )
            .fetch_all(pool.get_ref());

            let rows = match query.await {
                Ok(rows) => rows,
                Err(_) => return HttpResponse::InternalServerError().finish(),
            };

            rows.iter()
                .map(|row| Transaction {
                    id: row.id,
                    title: row.title.clone(),
                    description: row.description.clone(),
                    amount: row.amount,
                    user_id: row.user_id,
                })
                .collect::<Vec<Transaction>>()
        }
    };

    let body = serde_json::to_string(&transactions).expect("Failed to serialize transactions");

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[derive(Deserialize)]
struct TransactionDto {
    title: String,
    description: Option<String>,
    amount: f64,
    user_id: i32,
}

#[post("/splits/{split_id}/transactions")]
pub async fn post(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<String>,
    body: web::Json<TransactionDto>,
) -> impl Responder {
    let split_id = path.into_inner();
    let transaction = body.into_inner();

    let query = sqlx::query!(
        "
        INSERT INTO transaction (title, description, amount, user_id, split_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        ",
        transaction.title,
        transaction.description,
        transaction.amount as f32,
        transaction.user_id,
        split_id
    )
    .fetch_one(pool.get_ref());

    let row = match query.await {
        Ok(row) => row,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let transaction = Transaction {
        id: row.id,
        title: row.title.clone(),
        description: row.description.clone(),
        amount: row.amount as f64,
        user_id: row.user_id,
    };

    let body = serde_json::to_string(&transaction).expect("Failed to serialize transaction");

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[put("/splits/{split_id}/transactions/{transaction_id}")]
pub async fn put(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(String, i32)>,
    body: web::Json<TransactionDto>,
) -> impl Responder {
    let (split_id, transaction_id) = path.into_inner();
    let transaction = body.into_inner();

    let query = sqlx::query!(
        "
        UPDATE transaction
        SET title = $1, description = $2,
        amount = $3, user_id = $4
        WHERE id = $5 AND split_id = $6
        RETURNING *
        ",
        transaction.title,
        transaction.description,
        transaction.amount as f32,
        transaction.user_id,
        transaction_id,
        split_id
    )
    .fetch_one(pool.get_ref());

    let row = match query.await {
        Ok(row) => row,
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    let transaction = Transaction {
        id: row.id,
        title: row.title.clone(),
        description: row.description.clone(),
        amount: row.amount as f64,
        user_id: row.user_id,
    };

    let body = serde_json::to_string(&transaction).expect("Failed to serialize transaction");

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[delete("/splits/{split_id}/transactions/{transaction_id}")]
pub async fn delete(
    pool: web::Data<Pool<Postgres>>,
    path: web::Path<(String, i32)>,
) -> impl Responder {
    let (split_id, transaction_id) = path.into_inner();

    let query = sqlx::query!(
        "
        DELETE FROM transaction
        WHERE id = $1 AND split_id = $2
        ",
        transaction_id,
        split_id
    )
    .execute(pool.get_ref());

    match query.await {
        Ok(_) => (),
        Err(_) => return HttpResponse::InternalServerError().finish(),
    }

    HttpResponse::Ok().finish()
}
