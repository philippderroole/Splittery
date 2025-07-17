use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use sqlx::PgPool;

use crate::{controllers::TagResponse, services};

pub async fn get_all_member_tags(
    State(pool): State<PgPool>,
    Path((public_split_id, public_member_id)): Path<(String, String)>,
) -> Result<Json<Vec<TagResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let member_id = public_member_id.parse().unwrap();
    let splits = match services::get_all_member_tags(&pool, split_id, member_id).await {
        Ok(tags) => tags,
        Err(e) => {
            log::error!("Failed to get tags, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let splits: Vec<TagResponse> = splits.into_iter().map(TagResponse::from).collect();

    Ok(Json(splits))
}

pub async fn add_tag_to_member(
    State(pool): State<PgPool>,
    Path((split_url, member_id)): Path<(String, String)>,
    Path(tag_id): Path<String>,
) -> Result<StatusCode, StatusCode> {
    let split_id: uuid::Uuid = split_url.parse().unwrap();
    let member_id = member_id.parse().unwrap();
    let tag_id = tag_id.parse().unwrap();
    services::add_tag_to_member(&pool, split_id, member_id, tag_id)
        .await
        .map_err(|e| {
            log::error!("Failed to add tag to member: {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(StatusCode::CREATED)
}

pub async fn remove_tag_from_member(
    State(pool): State<PgPool>,
    Path((split_url, member_id)): Path<(String, String)>,
    Path(tag_id): Path<String>,
) -> Result<(), StatusCode> {
    let split_id = split_url.parse().unwrap();
    let member_id = member_id.parse().unwrap();
    let tag_id = tag_id.parse().unwrap();

    match services::remove_tag_from_member(&pool, split_id, member_id, tag_id).await {
        Ok(_) => Ok(()),
        Err(e) => {
            log::error!("Failed to remove tag from member: {e}");
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}
