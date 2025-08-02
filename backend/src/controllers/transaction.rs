use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{
    controllers::{self, EntryResponse, SplitUpdateMessage},
    models::Transaction,
    services::{self, CreateTransactionError},
};

#[derive(Serialize, Clone)]
pub struct TransactionResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    pub amount: i64,
    #[serde(rename = "memberId")]
    pub public_member_id: String,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub entries: Vec<EntryResponse>,
    #[serde(rename = "tagIds")]
    pub public_tag_ids: Vec<String>,
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
                .map(|entry| EntryResponse::from(entry, &transaction.public_id))
                .collect(),
            public_tag_ids: transaction
                .tags
                .into_iter()
                .map(|tag| tag.public_id)
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
    let transactions = services::get_transactions_for_split(&pool, split_id)
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
    #[serde(rename = "tagIds")]
    pub public_tag_ids: Vec<String>,
}

pub async fn create_transaction(
    State(pool): State<PgPool>,
    Path(split_url): Path<String>,
    Json(payload): Json<CreateTransactionRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let member_id = payload.public_member_id.parse().unwrap();
    let tag_ids = payload
        .public_tag_ids
        .into_iter()
        .map(|id| id.parse().unwrap())
        .collect();

    let transaction = services::create_transaction(
        &pool,
        split_id,
        member_id,
        payload.name,
        payload.amount,
        tag_ids,
    )
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

    let response = TransactionResponse::from(transaction.clone(), payload.public_member_id.clone());

    controllers::broadcast_split_update(
        &split_url,
        &SplitUpdateMessage::TransactionCreated {
            transaction: response.clone(),
        },
    )
    .await;

    Ok(Json(response))
}

pub async fn update_transaction(
    State(pool): State<PgPool>,
    Path((public_split_id, public_transaction_id)): Path<(String, String)>,
    Json(payload): Json<CreateTransactionRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let transaction_id = public_transaction_id.parse().unwrap();
    let tag_ids = payload
        .public_tag_ids
        .into_iter()
        .map(|id| id.parse().unwrap())
        .collect();

    let transaction = services::update_transaction(
        &pool,
        split_id,
        transaction_id,
        payload.name,
        payload.amount,
        tag_ids,
    )
    .await
    .map_err(|e| {
        log::error!("Failed to update transaction: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    let response = TransactionResponse::from(transaction.clone(), payload.public_member_id.clone());

    controllers::broadcast_split_update(
        &public_split_id,
        &SplitUpdateMessage::TransactionUpdated {
            transaction: response.clone(),
        },
    )
    .await;

    Ok(Json(response))
}

pub async fn delete_transaction(
    State(pool): State<PgPool>,
    Path((public_split_id, public_transaction_id)): Path<(String, String)>,
) -> Result<StatusCode, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let transaction_id = public_transaction_id.parse().unwrap();

    services::delete_transaction(&pool, split_id, transaction_id)
        .await
        .map_err(|e| {
            log::error!("Failed to delete transaction: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    controllers::broadcast_split_update(
        &public_split_id,
        &SplitUpdateMessage::TransactionDeleted {
            transaction_id: public_transaction_id,
        },
    )
    .await;

    Ok(StatusCode::NO_CONTENT)
}
