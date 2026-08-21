use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{middleware::UserId, models::Split, services};

#[derive(Debug, Deserialize)]
pub struct CreateSplitRequest {
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SplitResponse {
    pub id: String,
    pub name: String,
}

impl From<Split> for SplitResponse {
    fn from(split: Split) -> Self {
        Self {
            id: split.id.to_string(),
            name: split.name,
        }
    }
}

pub async fn get_all_splits(
    State(pool): State<PgPool>,
    UserId(user_id): UserId,
) -> Result<Json<Vec<SplitResponse>>, StatusCode> {
    let splits = match services::get_splits(&pool, user_id).await {
        Ok(splits) => splits,
        Err(e) => {
            log::error!("Failed to get splits, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let splits: Vec<SplitResponse> = splits.into_iter().map(SplitResponse::from).collect();

    Ok(Json(splits))
}

pub async fn create_split(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateSplitRequest>,
) -> Result<Json<SplitResponse>, StatusCode> {
    let split = match services::create_split(&pool, payload.name).await {
        Ok(split) => split,
        Err(e) => {
            log::error!("Failed to create split, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    Ok(Json(SplitResponse::from(split)))
}

pub async fn get_split(
    State(pool): State<PgPool>,
    Path(split_url): Path<String>,
) -> Result<Json<SplitResponse>, StatusCode> {
    let split = match services::get_split(&pool, split_url).await {
        Ok(Some(split)) => split,
        Ok(None) => return Err(StatusCode::NOT_FOUND),
        Err(e) => {
            log::error!("Failed to get split, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    Ok(Json(SplitResponse::from(split)))
}

pub async fn track_split_visit(
    State(pool): State<PgPool>,
    UserId(user_id): UserId,
    Path(split_id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    services::track_split_visit(&pool, user_id, split_id)
        .await
        .map_err(|e| match e {
            services::TrackSplitVisitError::SplitNotFoundOrNoAccess => StatusCode::NOT_FOUND,
            services::TrackSplitVisitError::Unexpected(err) => {
                log::error!("Failed to track split visit: {err}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    Ok(StatusCode::NO_CONTENT)
}
