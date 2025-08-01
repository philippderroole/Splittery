use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{
    models::{Tag, TagType},
    services::{self},
};

#[derive(Serialize)]
pub struct EntryTagResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    pub color: String,
    #[serde(rename = "splitId")]
    pub public_split_id: String,
    pub r#type: TagType,
}

impl EntryTagResponse {
    fn from(tag: Tag, public_split_id: String) -> Self {
        Self {
            public_id: tag.public_id,
            name: tag.name,
            color: tag.color,
            public_split_id,
            r#type: tag.r#type,
        }
    }
}

pub async fn get_all_entry_tags(
    State(pool): State<PgPool>,
    Path((public_split_id, _public_transaction_id, public_entry_id)): Path<(
        String,
        String,
        String,
    )>,
) -> Result<Json<Vec<EntryTagResponse>>, StatusCode> {
    let entry_id = public_entry_id.parse().unwrap();
    let tags = services::get_tags_for_entry(&pool, entry_id)
        .await
        .map_err(|e| {
            log::error!("Failed to get entry tags: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(
        tags.into_iter()
            .map(|tag| EntryTagResponse::from(tag, public_split_id.clone()))
            .collect(),
    ))
}

#[derive(Debug, Deserialize)]
pub struct AddTagToEntryRequest {
    #[serde(rename = "tagId")]
    pub public_tag_id: String,
}

pub async fn add_tag_to_entry(
    State(pool): State<PgPool>,
    Path((public_split_id, _public_transaction_id, public_entry_id)): Path<(
        String,
        String,
        String,
    )>,
    Json(request): Json<AddTagToEntryRequest>,
) -> Result<StatusCode, StatusCode> {
    let split_id: uuid::Uuid = public_split_id.parse().unwrap();
    let entry_id = public_entry_id.parse().unwrap();
    let tag_id = request.public_tag_id.parse().unwrap();

    services::add_tag_to_entry(&pool, split_id, entry_id, tag_id)
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
