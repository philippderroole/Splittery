use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::services::{self, EntryTagResponse};

pub async fn get_all_entry_tags(
    State(pool): State<PgPool>,
    Path((public_split_id, public_transaction_id, public_entry_id)): Path<(String, String, String)>,
) -> Result<Json<Vec<EntryTagResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let transaction_id = public_transaction_id.parse().unwrap();
    let entry_id = public_entry_id.parse().unwrap();
    let tags = services::get_all_entry_tags(&pool, split_id, transaction_id, entry_id)
        .await
        .map_err(|e| {
            log::error!("Failed to get entry tags: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(tags))
}

#[derive(Debug, Deserialize)]
pub struct AddTagToEntryRequest {
    #[serde(rename = "tagId")]
    pub public_tag_id: String,
}

pub async fn add_tag_to_entry(
    State(pool): State<PgPool>,
    Path((public_split_id, public_transaction_id, public_entry_id)): Path<(String, String, String)>,
    Json(request): Json<AddTagToEntryRequest>,
) -> Result<StatusCode, StatusCode> {
    let split_id: uuid::Uuid = public_split_id.parse().unwrap();
    let transaction_id = public_transaction_id.parse().unwrap();
    let entry_id = public_entry_id.parse().unwrap();
    let tag_id = request.public_tag_id.parse().unwrap();
    services::add_tag_to_entry(&pool, split_id, transaction_id, entry_id, tag_id)
        .await
        .map_err(|e| {
            log::error!("Failed to add tag to member: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(StatusCode::CREATED)
}

pub async fn remove_tag_from_entry(
    State(pool): State<PgPool>,
    Path((split_url, member_id)): Path<(String, String)>,
    Path(tag_id): Path<String>,
) -> Result<(), StatusCode> {
    let split_id = split_url.parse().unwrap();
    let member_id = member_id.parse().unwrap();
    let tag_id = tag_id.parse().unwrap();

    match services::remove_tag_from_entry(&pool, split_id, member_id, tag_id).await {
        Ok(_) => Ok(()),
        Err(e) => {
            log::error!("Failed to remove tag from member: {e}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
