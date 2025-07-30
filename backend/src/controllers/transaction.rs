use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{
    controllers::EntryResponse,
    models::{Transaction, TransactionDb},
    services::{self, CreateTransactionError},
};

#[derive(Serialize)]
pub struct TransactionResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    pub amount: i64,
    #[serde(rename = "memberId")]
    pub public_member_id: String,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub entries: Vec<EntryResponse>,
    #[serde(rename = "executedAt")]
    pub executed_at: String,
}

impl TransactionResponse {
    fn from(transaction: Transaction, public_member_id: String) -> Self {
        Self {
            public_id: transaction.public_id.clone(),
            name: transaction.name,
            amount: transaction.amount,
            public_member_id,
            entries: transaction
                .entries
                .into_iter()
                .map(|entry| EntryResponse::from(entry, transaction.public_id.clone()))
                .collect(),
            executed_at: transaction.executed_at.to_rfc3339(),
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

    let members = services::get_all_members(&pool, split_id)
        .await
        .map_err(|e| {
            log::error!("Failed to get split members: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let mut response = Vec::new();

    for transaction in transactions {
        let public_member_id = members
            .iter()
            .find(|m| m.id == transaction.member_id)
            .map(|m| m.public_id.clone())
            .ok_or_else(|| {
                log::error!(
                    "Member not found for transaction: {}",
                    transaction.public_id
                );
                StatusCode::NOT_FOUND
            })?;

        response.push(TransactionResponse::from(transaction, public_member_id));
    }

    Ok(Json(response))
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

    Ok(Json(TransactionResponse::from(
        transaction,
        payload.public_member_id,
    )))
}

pub async fn get_transaction(
    State(pool): State<PgPool>,
    Path((split_url, transaction_url)): Path<(String, String)>,
) -> Result<Json<TransactionDb>, StatusCode> {
    unimplemented!();
}

pub async fn update_transaction(
    State(pool): State<PgPool>,
    Path((split_url, transaction_url)): Path<(String, String)>,
    Json(payload): Json<CreateTransactionRequest>,
) -> Result<Json<TransactionDb>, StatusCode> {
    unimplemented!();
}

pub async fn delete_transaction(
    State(pool): State<PgPool>,
    Path((split_url, transaction_url)): Path<(String, String)>,
) -> Result<StatusCode, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let transaction_id = transaction_url.parse().unwrap();

    services::delete_transaction(&pool, split_id, transaction_id)
        .await
        .map_err(|e| {
            log::error!("Failed to delete transaction: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(StatusCode::NO_CONTENT)
}
