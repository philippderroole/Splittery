use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::{
    models::{Tag, TagType},
    services::{self, DeleteTagError},
};

#[derive(Serialize, Clone)]
pub struct TagResponse {
    pub id: String,
    pub name: String,
    pub color: String,
    pub r#type: TagType,
}

impl From<Tag> for TagResponse {
    fn from(tag: Tag) -> Self {
        Self {
            id: tag.public_id,
            name: tag.name,
            color: tag.color,
            r#type: tag.r#type,
        }
    }
}

pub async fn get_all_split_tags(
    State(pool): State<PgPool>,
    Path(split_url): Path<String>,
) -> Result<Json<Vec<TagResponse>>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let splits = match services::get_tags(&pool, split_id).await {
        Ok(tags) => tags,
        Err(e) => {
            log::error!("Failed to get tags, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let splits: Vec<TagResponse> = splits.into_iter().map(TagResponse::from).collect();

    Ok(Json(splits))
}

#[derive(Deserialize)]
pub struct CreateTagRequest {
    pub name: String,
    pub color: String,
}

pub async fn create_tag(
    State(pool): State<PgPool>,
    Path(split_url): Path<String>,
    Json(tag): Json<CreateTagRequest>,
) -> Result<Json<TagResponse>, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let tag = match services::create_tag(&pool, split_id, &tag.name, &tag.color, TagType::CustomTag)
        .await
    {
        Ok(tag) => tag,
        Err(e) => {
            log::error!("Failed to create tag, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    Ok(Json(TagResponse::from(tag)))
}

#[derive(Deserialize)]
pub struct EditTagRequest {
    pub name: String,
    pub color: String,
}

pub async fn edit_tag(
    State(pool): State<PgPool>,
    Path((public_split_id, public_tag_id)): Path<(String, String)>,
    Json(tag): Json<EditTagRequest>,
) -> Result<Json<TagResponse>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let tag_id = public_tag_id.parse().unwrap();

    let tag = services::edit_tag(&pool, split_id, tag_id, &tag.name, &tag.color)
        .await
        .map_err(|e| {
            log::error!("Failed to edit tag, {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(TagResponse::from(tag)))
}

pub async fn delete_tag(
    State(pool): State<PgPool>,
    Path((split_url, tag_url)): Path<(String, String)>,
) -> Result<StatusCode, StatusCode> {
    let split_id = split_url.parse().unwrap();
    let tag_id = tag_url.parse().unwrap();

    services::delete_tag(&pool, split_id, tag_id, false)
        .await
        .map_err(|e| match e {
            DeleteTagError::NotFound => {
                log::warn!("Tag not found: {tag_id}");
                StatusCode::NOT_FOUND
            }
            DeleteTagError::NonCustomTagDeletionNotAllowed => {
                log::warn!("Attempted to delete a non-custom tag: {tag_id}");
                StatusCode::FORBIDDEN
            }
            DeleteTagError::UnexpectedError(e) => {
                log::error!("Failed to delete tag, {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    Ok(StatusCode::NO_CONTENT)
}
