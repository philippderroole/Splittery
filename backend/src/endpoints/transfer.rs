use actix_web::{get, http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct Transfer {
    id: i32,
    from_id: i32,
    to_id: i32,
}

#[get("/splits/{split_id}/transactions/transfers/{transfer_id}")]
pub async fn get(pool: web::Data<Pool<Postgres>>, path: web::Path<(i32, i32)>) -> impl Responder {
    let (_, transfer_id) = path.into_inner();

    let row = sqlx::query!(
        "
        SELECT *
        FROM transfer
        WHERE id = $1
        ",
        transfer_id,
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let transfer = Transfer {
        id: row.id,
        from_id: row.from_id,
        to_id: row.to_id,
    };

    let body = serde_json::to_string(&transfer).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[get("/splits/{split_id}/transactions/transfers")]
pub async fn get_multiple(pool: web::Data<Pool<Postgres>>, path: web::Path<i32>) -> impl Responder {
    let split_id = path.into_inner();

    let transfers = sqlx::query!(
        "
        SELECT transfer.*
        FROM transfer
        INNER JOIN transaction ON transfer.from_id = transaction.id
        WHERE transaction.split_id = $1
        ",
        split_id
    )
    .fetch_all(pool.get_ref())
    .await
    .unwrap();

    let transfers: Vec<Transfer> = transfers
        .into_iter()
        .map(|row| Transfer {
            id: row.id,
            from_id: row.from_id,
            to_id: row.to_id,
        })
        .collect();

    let body = serde_json::to_string(&transfers).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}

#[derive(Deserialize)]
pub struct TransferDto {
    from_id: i32,
    to_id: i32,
}

#[post("/splits/{split_id}/transactions/transfers")]
pub async fn post(
    pool: web::Data<Pool<Postgres>>,
    _path: web::Path<i32>,
    body: web::Json<TransferDto>,
) -> impl Responder {
    let transfer = body.into_inner();

    let row = sqlx::query!(
        "
        INSERT INTO transfer (from_id, to_id)
        VALUES ($1, $2)
        RETURNING *
        ",
        transfer.from_id,
        transfer.to_id
    )
    .fetch_one(pool.get_ref())
    .await
    .unwrap();

    let transfer = Transfer {
        id: row.id,
        from_id: row.from_id,
        to_id: row.to_id,
    };

    let body = serde_json::to_string(&transfer).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(body)
}
