use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{models::Entry, services};

#[derive(Debug, Serialize, Deserialize)]
pub struct EntryResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    #[serde(rename = "transactionId")]
    pub public_transaction_id: String,
    pub amount: i64,
    #[serde(rename = "tagIds")]
    pub public_tag_ids: Vec<String>,
}

impl EntryResponse {
    pub fn from(entry: Entry, public_transaction_id: String) -> Self {
        Self {
            public_id: entry.public_id,
            name: entry.name,
            public_transaction_id,
            amount: entry.amount,
            public_tag_ids: entry.tags.into_iter().map(|tag| tag.public_id).collect(),
        }
    }
}

pub async fn get_entries_for_transaction(
    State(pool): State<PgPool>,
    Path((_split_url, public_transaction_id)): Path<(String, String)>,
) -> Result<Json<Vec<EntryResponse>>, StatusCode> {
    let entries =
        services::get_entries_for_transaction(&pool, public_transaction_id.parse().unwrap())
            .await
            .map_err(|e| {
                log::error!("Failed to get entries for transaction: {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            })?;

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
    #[serde(rename = "tagIds")]
    pub public_tag_ids: Vec<String>,
}

pub async fn create_entry(
    State(pool): State<PgPool>,
    Path((split_url, public_transaction_id)): Path<(String, String)>,
    Json(payload): Json<CreateEntryRequest>,
) -> Result<Json<EntryResponse>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let transaction_id = public_transaction_id.parse().unwrap();
    let entry = services::create_entry(
        &pool,
        split_id,
        transaction_id,
        payload.name,
        payload.amount,
    )
    .await
    .map_err(|e| {
        log::error!("Failed to create entry: {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    for tag_id in payload.public_tag_ids {
        let tag_id = tag_id.parse().unwrap();

        services::add_tag_to_entry(&pool, split_id, transaction_id, entry.id, tag_id)
            .await
            .map_err(|e| {
                log::error!("Failed to add tag to entry: {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            })?;
    }

    Ok(Json(EntryResponse::from(entry, public_transaction_id)))
}

#[derive(Debug, Deserialize)]
pub struct UpdateEntryRequest {
    pub name: String,
    pub amount: i64,
    #[serde(rename = "tagIds")]
    pub public_tag_ids: Vec<String>,
}

pub async fn update_entry(
    State(pool): State<PgPool>,
    Path((_split_url, transaction_url, public_entry_id)): Path<(String, String, String)>,
    Json(payload): Json<UpdateEntryRequest>,
) -> Result<Json<EntryResponse>, StatusCode> {
    let transaction_id = transaction_url.parse().unwrap();
    let entry_id = public_entry_id.parse().unwrap();
    let tag_ids: Vec<_> = payload
        .public_tag_ids
        .into_iter()
        .map(|id| id.parse().unwrap())
        .collect();

    let entry = services::update_entry(&pool, entry_id, payload.name, payload.amount)
        .await
        .map_err(|e| {
            log::error!("Failed to update entry: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    services::set_tags_for_entry(&pool, entry_id, &tag_ids)
        .await
        .map_err(|e| {
            log::error!("Failed to set tags for entry: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(EntryResponse::from(entry, transaction_id)))
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
