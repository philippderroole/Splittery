use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{models::TransactionEntry, services};

#[derive(Debug, Serialize, Deserialize)]
pub struct EntryResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    #[serde(rename = "transactionId")]
    pub public_transaction_id: String,
    pub amount: i64,
}

impl EntryResponse {
    fn from(item: TransactionEntry, public_transaction_id: String) -> Self {
        Self {
            public_id: item.public_id,
            name: item.name,
            public_transaction_id,
            amount: item.amount,
        }
    }
}

pub async fn get_all_transaction_entries(
    State(pool): State<PgPool>,
    Path((_split_url, public_transaction_id)): Path<(String, String)>,
) -> Result<Json<Vec<EntryResponse>>, StatusCode> {
    let entries =
        match services::get_all_entries(&pool, public_transaction_id.parse().unwrap()).await {
            Ok(members) => members,
            Err(e) => {
                log::error!("Failed to get members, {e}");
                return Err(StatusCode::INTERNAL_SERVER_ERROR);
            }
        };

    let response: Vec<EntryResponse> = entries
        .into_iter()
        .map(|entry| EntryResponse::from(entry, public_transaction_id.clone()))
        .collect();
    Ok(Json(response))
}

#[derive(Debug, Deserialize)]
pub struct CreateEntryRequest {
    pub name: String,
    pub amount: i64,
}

#[axum::debug_handler]
pub async fn create_transaction_entry(
    State(pool): State<PgPool>,
    Path((split_url, public_transaction_id)): Path<(String, String)>,
    Json(payload): Json<CreateEntryRequest>,
) -> Result<Json<EntryResponse>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let transaction_id = public_transaction_id.parse().unwrap();
    let entry = match services::create_entry(
        &pool,
        split_id,
        transaction_id,
        payload.name,
        payload.amount,
    )
    .await
    {
        Ok(entry) => entry,
        Err(e) => {
            log::error!("Failed to create entry, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    Ok(Json(EntryResponse::from(entry, public_transaction_id)))
}

pub async fn delete_entry(
    State(pool): State<PgPool>,
    Path((_split_url, _transaction_url, item_url)): Path<(String, String, String)>,
) -> Result<StatusCode, StatusCode> {
    let item_url = item_url.parse().unwrap();
    match services::delete_entry(&pool, item_url).await {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(e) => {
            log::error!("Failed to delete entry, {e}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
