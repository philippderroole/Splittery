use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use bigdecimal::ToPrimitive;
use serde::Serialize;
use sqlx::PgPool;

use crate::{
    controllers::{self, SplitUpdateMessage, TagResponse},
    models::member::{Member, MemberType},
    services::{self, CreateMemberError, DeleteTagError},
};

#[derive(serde::Serialize, Clone)]
pub enum MemberTypeResponse {
    Registered,
    Guest,
}

impl From<MemberType> for MemberTypeResponse {
    fn from(member_type: MemberType) -> Self {
        match member_type {
            MemberType::Registered => MemberTypeResponse::Registered,
            MemberType::Guest => MemberTypeResponse::Guest,
        }
    }
}

#[derive(Serialize, Clone)]
pub struct MemberResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    #[serde(rename = "splitId")]
    pub split_id: String,
    #[serde(rename = "amountSpent")]
    pub amount_spent: i64,
    #[serde(rename = "amountShare")]
    pub amount_share: i64,
    pub r#type: MemberTypeResponse,
    #[serde(rename = "tagIds")]
    pub public_tag_ids: Vec<String>,
}

impl MemberResponse {
    fn from(member: Member, public_split_id: &str, amount_spent: i64, amount_share: i64) -> Self {
        Self {
            public_id: member.public_id,
            name: member.name,
            split_id: public_split_id.to_string(),
            amount_spent,
            amount_share,
            r#type: member.r#type.into(),
            public_tag_ids: member.tags.into_iter().map(|tag| tag.public_id).collect(),
        }
    }
}

pub async fn get_all_members(
    State(pool): State<PgPool>,
    Path(public_split_id): Path<String>,
) -> Result<Json<Vec<MemberResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();

    let members = services::get_all_members(&pool, split_id)
        .await
        .map_err(|e| {
            log::error!("Failed to get members with tags, {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let mut members_with_tags_response = Vec::new();

    for member in members.into_iter() {
        let amount_spent = services::get_member_amount_spent(&pool, split_id, member.id)
            .await
            .map_err(|e| {
                log::error!("Failed to get member balance, {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            })?;

        let amount_share = services::get_member_share(&pool, member.id)
            .await
            .map_err(|e| {
                log::error!("Failed to get member share, {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            })?;

        let member_response = MemberResponse::from(
            member,
            &public_split_id,
            amount_spent.to_i64().unwrap(),
            amount_share.to_i64().unwrap(),
        );

        members_with_tags_response.push(member_response);
    }

    Ok(Json(members_with_tags_response))
}

#[derive(serde::Deserialize)]
pub struct CreateMemberRequest {
    pub name: String,
}

pub async fn create_member(
    State(pool): State<PgPool>,
    Path(public_split_id): Path<String>,
    Json(request): Json<CreateMemberRequest>,
) -> Result<Json<MemberResponse>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();

    let member = services::create_member(&pool, split_id, request.name)
        .await
        .map_err(|e| match e {
            CreateMemberError::DuplicateMemberName => {
                log::error!("Duplicate member name");
                StatusCode::CONFLICT
            }
            CreateMemberError::UnexpectedError(e) => {
                log::error!("{e}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    let response = MemberResponse::from(member.clone(), &public_split_id, 0, 0);

    controllers::broadcast_split_update(
        &public_split_id,
        &SplitUpdateMessage::MemberCreated {
            member: response.clone(),
            tags: member.tags.into_iter().map(TagResponse::from).collect(),
        },
    )
    .await;

    Ok(Json(response))
}

#[derive(serde::Deserialize)]
pub struct EditMemberRequest {
    pub name: String,
    #[serde(rename = "tagIds")]
    pub tag_ids: Vec<String>,
}

pub async fn edit_member(
    State(pool): State<PgPool>,
    Path((public_split_id, public_member_id)): Path<(String, String)>,
    Json(request): Json<EditMemberRequest>,
) -> Result<Json<MemberResponse>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let member_id = public_member_id.parse().unwrap();
    let tag_ids = request
        .tag_ids
        .iter()
        .map(|id| id.parse().unwrap())
        .collect();

    let member = services::edit_member(&pool, split_id, member_id, request.name)
        .await
        .map_err(|e| {
            log::error!("Failed to get member, {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    services::set_tags_for_member(&pool, split_id, member_id, &tag_ids)
        .await
        .map_err(|e| {
            log::error!("Failed to create tag for member, {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    controllers::broadcast_split_update(
        &public_split_id,
        &SplitUpdateMessage::MemberUpdated {
            member: MemberResponse::from(member.clone(), &public_split_id, 0, 0),
            tags: member
                .tags
                .clone()
                .into_iter()
                .map(TagResponse::from)
                .collect(),
        },
    )
    .await;

    Ok(Json(MemberResponse::from(member, &public_split_id, 0, 0)))
}

pub async fn delete_member(
    State(pool): State<PgPool>,
    Path((public_split_id, member_url)): Path<(String, String)>,
) -> Result<StatusCode, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let member_id = member_url.parse().unwrap();

    let member = match services::get_member(&pool, split_id, member_id).await {
        Ok(member) => member,
        Err(e) => {
            log::error!("Failed to get member, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    services::delete_tag_by_name(&pool, split_id, &member.name, true)
        .await
        .map_err(|e| match e {
            DeleteTagError::NonCustomTagDeletionNotAllowed => {
                log::warn!("Attempted to delete a non-custom tag: {}", member.name);
                StatusCode::FORBIDDEN
            }
            e => {
                log::error!("Failed to delete tag for member: {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            }
        })?;

    match services::delete_member(&pool, &member_id).await {
        Ok(_) => {}
        Err(e) => {
            log::error!("Failed to delete member: {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    Ok(StatusCode::NO_CONTENT)
}
