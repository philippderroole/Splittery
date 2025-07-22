use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
};
use bigdecimal::ToPrimitive;
use serde::Serialize;
use sqlx::PgPool;

use crate::{
    controllers::TagResponse,
    models::{MemberType, SplitMember},
    services::{self, CreateMemberError, DeleteTagError},
};

#[derive(serde::Serialize)]
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

#[derive(serde::Serialize)]
pub struct MemberResponse {
    pub id: String,
    pub name: String,
    pub split_id: String,
    pub saldo: i64,
    pub r#type: MemberTypeResponse,
}

impl MemberResponse {
    fn from(member: SplitMember, public_split_id: String, saldo: i64) -> Self {
        Self {
            id: member.public_id,
            name: member.name,
            split_id: public_split_id,
            saldo,
            r#type: member.r#type.into(),
        }
    }
}

pub async fn get_all_members(
    State(pool): State<PgPool>,
    Path(public_split_id): Path<String>,
) -> Result<Json<Vec<MemberResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();

    let members = match services::get_all_members(&pool, split_id).await {
        Ok(members) => members,
        Err(e) => {
            log::error!("Failed to get members, {e}");
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let mut response: Vec<MemberResponse> = Vec::new();

    for member in members {
        let saldo = services::get_member_balance(&pool, split_id, member.id)
            .await
            .map_err(|e| {
                log::error!("Failed to get member balance, {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            })?;

        response.push(MemberResponse::from(
            member,
            public_split_id.clone(),
            saldo.to_i64().unwrap(),
        ));
    }

    Ok(Json(response))
}

#[derive(Serialize)]
pub struct MemberWithTagsResponse {
    #[serde(rename = "id")]
    pub public_id: String,
    pub name: String,
    pub split_id: String,
    pub saldo: i64,
    pub r#type: MemberTypeResponse,
    pub tags: Vec<TagResponse>,
}

pub async fn get_members_with_tags(
    State(pool): State<PgPool>,
    Path(public_split_id): Path<String>,
) -> Result<Json<Vec<MemberWithTagsResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();

    let members_with_tags = services::get_members_with_tags(&pool, split_id)
        .await
        .map_err(|e| {
            log::error!("Failed to get members with tags, {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    let mut members_with_tags_response = Vec::new();

    for (member, tags) in members_with_tags.into_iter() {
        let saldo = services::get_member_balance(&pool, split_id, member.id)
            .await
            .map_err(|e| {
                log::error!("Failed to get member balance, {e}");
                StatusCode::INTERNAL_SERVER_ERROR
            })?;

        let member_response =
            MemberResponse::from(member, public_split_id.clone(), saldo.to_i64().unwrap());

        let member_response = MemberWithTagsResponse {
            public_id: member_response.id,
            name: member_response.name,
            split_id: member_response.split_id,
            saldo: member_response.saldo,
            r#type: member_response.r#type,
            tags: tags.into_iter().map(TagResponse::from).collect(),
        };

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
) -> Result<Json<Vec<MemberResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let color = String::from("#ff5858ff"); // Default color, can be changed later

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

    let tag = services::create_tag(
        &pool,
        split_id,
        &member.name,
        &color,
        crate::models::TagType::UserTag,
    )
    .await
    .map_err(|e| {
        log::error!("Failed to create tag for member, {e}");
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    services::add_tag_to_member(&pool, split_id, member.id, tag.id)
        .await
        .map_err(|e| {
            log::error!("Failed to add tag to member, {e}");
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    Ok(Json(vec![MemberResponse::from(member, public_split_id, 0)]))
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
) -> Result<Json<Vec<MemberResponse>>, StatusCode> {
    let split_id = public_split_id.parse().unwrap();
    let member_id = public_member_id.parse().unwrap();
    let tag_ids: Vec<_> = request
        .tag_ids
        .iter()
        .map(|id| id.parse().unwrap())
        .collect();

    let member = services::edit_member(&pool, member_id, request.name)
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

    Ok(Json(vec![MemberResponse::from(member, public_split_id, 0)]))
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
