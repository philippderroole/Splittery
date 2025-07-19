use std::fmt;

use anyhow::{Result, anyhow};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{Tag, TagDb};

pub async fn get_tags(pool: &PgPool, split_id: Uuid) -> Result<Vec<Tag>> {
    sqlx::query_as!(
        TagDb,
        "
        SELECT id, public_id, name, color, split_id, is_custom, created_at, updated_at
        FROM tags
        WHERE split_id = $1
        ",
        split_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get tags: {}", e))
    .map(|tags| tags.into_iter().map(Tag::from).collect::<Vec<Tag>>())
}

pub async fn create_tag(
    pool: &PgPool,
    split_id: Uuid,
    name: &String,
    color: &String,
    is_custom: bool,
) -> Result<Tag> {
    let tag_id = uuid::Uuid::new_v4();
    sqlx::query_as!(
        TagDb,
        "
        INSERT INTO tags (id, public_id, name, color, split_id, is_custom)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, public_id, name, color, split_id, is_custom, created_at, updated_at
        ",
        tag_id,
        tag_id.to_string(),
        name,
        color,
        split_id,
        is_custom,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to create tag: {}", e))
    .map(Tag::from)
}

#[derive(Debug)]
pub enum GetTagError {
    NotFound,
    PredefinedTagNotFound,
    UnexpectedError(anyhow::Error),
}

impl std::error::Error for GetTagError {}

impl fmt::Display for GetTagError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            GetTagError::NotFound => write!(f, "Tag not found"),
            GetTagError::PredefinedTagNotFound => {
                write!(f, "Predefined tag not found")
            }
            GetTagError::UnexpectedError(error) => error.fmt(f),
        }
    }
}

async fn get_tag(pool: &PgPool, split_id: Uuid, tag_id: Uuid) -> Result<Tag, GetTagError> {
    sqlx::query_as!(
        TagDb,
        "
        SELECT id, name, color, public_id, split_id, is_custom, created_at, updated_at FROM tags 
        WHERE split_id = $1 AND id = $2
        ",
        split_id,
        tag_id,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => GetTagError::NotFound,
        _ => GetTagError::UnexpectedError(anyhow!(e)),
    })
    .map(Tag::from)
}

pub async fn get_all_tag(pool: &PgPool, split_id: Uuid) -> Result<Tag, GetTagError> {
    get_tag_by_name(pool, split_id, &String::from("all"))
        .await
        .map_err(|e| match e {
            GetTagError::NotFound => GetTagError::PredefinedTagNotFound,
            e => e,
        })
}

pub async fn get_tag_by_name(
    pool: &PgPool,
    split_id: Uuid,
    tag_name: &String,
) -> Result<Tag, GetTagError> {
    sqlx::query_as!(
        TagDb,
        "
        SELECT id, name, color, public_id, split_id, is_custom, created_at, updated_at FROM tags 
        WHERE split_id = $1 AND name = $2
        ",
        split_id,
        tag_name,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => GetTagError::NotFound,
        _ => GetTagError::UnexpectedError(anyhow!(e)),
    })
    .map(Tag::from)
}

pub async fn edit_tag(
    pool: &PgPool,
    split_id: Uuid,
    tag_id: Uuid,
    name: &String,
    color: &String,
) -> Result<Tag> {
    sqlx::query_as!(
        TagDb,
        "
        UPDATE tags
        SET name = $1, color = $2, updated_at = NOW()
        WHERE split_id = $3 AND id = $4
        RETURNING id, public_id, name, color, split_id, is_custom, created_at, updated_at
        ",
        name,
        color,
        split_id,
        tag_id,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| anyhow!("Failed to edit tag: {}", e))
    .map(Tag::from)
}

#[derive(Debug)]
pub enum DeleteTagError {
    NotFound,
    NonCustomTagDeletionNotAllowed,
    UnexpectedError(anyhow::Error),
}

impl std::error::Error for DeleteTagError {}

impl fmt::Display for DeleteTagError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DeleteTagError::NotFound => write!(f, "Tag not found"),
            DeleteTagError::NonCustomTagDeletionNotAllowed => {
                write!(
                    f,
                    "Cannot delete non-custom tag without explicit permission"
                )
            }
            DeleteTagError::UnexpectedError(error) => error.fmt(f),
        }
    }
}

pub async fn delete_tag(
    pool: &PgPool,
    split_id: Uuid,
    tag_id: Uuid,
    delete_non_custom: bool,
) -> Result<(), DeleteTagError> {
    let tag = get_tag(pool, split_id, tag_id).await.map_err(|e| match e {
        GetTagError::NotFound => DeleteTagError::NotFound,
        GetTagError::PredefinedTagNotFound => DeleteTagError::NotFound,
        GetTagError::UnexpectedError(e) => DeleteTagError::UnexpectedError(e),
    })?;

    if !delete_non_custom && !tag.is_custom {
        return Err(DeleteTagError::NonCustomTagDeletionNotAllowed);
    }

    let query_result = sqlx::query!(
        "
        DELETE FROM tags
        WHERE split_id = $1 AND id = $2
        ",
        split_id,
        tag_id,
    )
    .execute(pool)
    .await;

    match query_result {
        Ok(result) if result.rows_affected() > 0 => Ok(()),
        Ok(_) => Err(DeleteTagError::NotFound),
        Err(e) => Err(DeleteTagError::UnexpectedError(anyhow!(e))),
    }
}

pub async fn delete_tag_by_name(
    pool: &PgPool,
    split_id: Uuid,
    tag_name: &String,
    delete_non_custom: bool,
) -> Result<(), DeleteTagError> {
    let tag = sqlx::query_as!(
        Tag,
        "
        SELECT id, name, color, public_id, split_id, is_custom, created_at, updated_at FROM tags 
        WHERE split_id = $1 AND name = $2
        ",
        split_id,
        tag_name,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => DeleteTagError::NotFound,
        _ => DeleteTagError::UnexpectedError(anyhow!(e)),
    })?;

    delete_tag(pool, split_id, tag.id, delete_non_custom).await
}
