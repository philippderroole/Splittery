use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{
    models::Transaction,
    services::{self, CreateTransactionError},
};

#[derive(Serialize)]
pub struct TransactionResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    pub amount: i64,
}

impl From<Transaction> for TransactionResponse {
    fn from(transaction: Transaction) -> Self {
        Self {
            public_id: transaction.public_id,
            name: transaction.name,
            amount: transaction.amount,
        }
    }
}

pub async fn get_all_transactions(
    State(pool): State<PgPool>,
    Path(split_url): Path<String>,
) -> Result<Json<Vec<TransactionResponse>>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let transactions = services::get_all_transactions(&pool, split_id)
        .await
        .map_err(|e| {
            log::error!("Failed to get transactions: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let transactions = transactions
        .into_iter()
        .map(TransactionResponse::from)
        .collect();

    Ok(Json(transactions))
}

#[derive(Debug, Deserialize)]
pub struct CreateTransactionRequest {
    pub name: String,
    pub amount: i64,
    #[serde(rename = "memberId")]
    pub public_member_id: String,
}

pub async fn create_transaction(
    State(pool): State<PgPool>,
    Path(split_url): Path<String>,
    Json(payload): Json<CreateTransactionRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let member_id = payload.public_member_id.parse().unwrap();
    let transaction =
        services::create_transaction(&pool, split_id, member_id, payload.name, payload.amount)
            .await
            .map_err(|e| match e {
                CreateTransactionError::TransactionMemberNotFound => {
                    log::error!("Transaction member not found: {e}");
                    StatusCode::NOT_FOUND
                }
                CreateTransactionError::UnexpectedError(e) => {
                    log::error!("Unexpected error creating transaction: {e}");
                    StatusCode::INTERNAL_SERVER_ERROR
                }
            })?;

    Ok(Json(TransactionResponse::from(transaction)))
}

pub async fn get_transaction(
    State(pool): State<PgPool>,
    Path((split_url, transaction_url)): Path<(String, String)>,
) -> Result<Json<Transaction>, StatusCode> {
    unimplemented!();
}

pub async fn update_transaction(
    State(pool): State<PgPool>,
    Path((split_url, transaction_url)): Path<(String, String)>,
    Json(payload): Json<CreateTransactionRequest>,
) -> Result<Json<Transaction>, StatusCode> {
    unimplemented!();
}

pub async fn delete_transaction(
    State(pool): State<PgPool>,
    Path((split_url, transaction_url)): Path<(String, String)>,
) -> Result<StatusCode, StatusCode> {
    unimplemented!();
}
