use std::collections::HashMap;
use std::fmt;

use crate::models::member::{Member, MemberDb, MemberType};
use crate::models::tag::{Tag, TagType};
use crate::services::{self, get_tags_for_member};
use anyhow::Result;
use anyhow::anyhow;
use bigdecimal::BigDecimal;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn get_all_members(pool: &PgPool, split_id: Uuid) -> Result<Vec<Member>> {
    let rows = sqlx::query!(
        "
        SELECT member.id AS member_id, member.public_id AS member_public_id, 
               member.name AS member_name, member.created_at AS member_created_at, member.updated_at AS member_updated_at,
               tags.id AS tag_id, tags.public_id AS tag_public_id, tags.type AS \"tag_type: TagType\",
               tags.name AS tag_name, tags.color AS tag_color, tags.updated_at AS tag_updated_at, tags.created_at AS tag_created_at
        FROM split_members AS member
        LEFT JOIN member_tags ON member.id = member_tags.member_id
        LEFT JOIN tags ON member_tags.tag_id = tags.id
        WHERE member.split_id = $1
        ",
        split_id
    )
    .fetch_all(pool)
    .await;

    let mut members: HashMap<Member, Vec<Tag>> = HashMap::new();
    match rows {
        Ok(results) => {
            for result in results {
                let member = Member {
                    id: result.member_id,
                    public_id: result.member_public_id,
                    split_id,
                    name: result.member_name,
                    r#type: MemberType::Guest,
                    tags: vec![],
                    created_at: result.member_created_at,
                    updated_at: result.member_updated_at,
                };
                let tag = Tag {
                    id: result.tag_id,
                    public_id: result.tag_public_id,
                    name: result.tag_name,
                    color: result.tag_color,
                    split_id,
                    r#type: result.tag_type,
                    created_at: result.tag_created_at,
                    updated_at: result.tag_updated_at,
                };

                members.entry(member).or_default().push(tag);
            }
        }
        Err(e) => return Err(anyhow!("Failed to get members with tags: {}", e)),
    }

    let members: Vec<Member> = members
        .into_iter()
        .map(|(member, tags)| {
            let mut member = member;
            member.tags = tags;
            member
        })
        .collect();

    Ok(members)
}

#[derive(Debug)]
pub enum CreateMemberError {
    DuplicateMemberName,
    UnexpectedError(anyhow::Error),
}

impl std::error::Error for CreateMemberError {}

impl fmt::Display for CreateMemberError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CreateMemberError::DuplicateMemberName => write!(f, "Duplicate member name"),
            CreateMemberError::UnexpectedError(error) => error.fmt(f),
        }
    }
}

pub async fn create_member(
    pool: &PgPool,
    split_id: Uuid,
    name: String,
) -> Result<Member, CreateMemberError> {
    let member_id = Uuid::new_v4();

    let member = sqlx::query_as!(
        MemberDb,
        "
        INSERT INTO split_members (id, public_id, name, split_id, type)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, public_id, name, split_id, type AS \"type: MemberType\", created_at, updated_at
        ",
        member_id,
        member_id.to_string(),
        name,
        split_id,
        MemberType::Guest as MemberType,
    )
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::Database(err)
            if err.constraint() == Some("split_members_split_id_name_key") =>
        {
            CreateMemberError::DuplicateMemberName
        }
        sqlx::Error::Database(err) if err.constraint().is_some() => {
            CreateMemberError::UnexpectedError(anyhow!(format!("{}", err.constraint().unwrap())))
        }
        e => CreateMemberError::UnexpectedError(anyhow!(e)),
    })?;

    let member_tag = services::create_tag(
        pool,
        split_id,
        &member.name,
        "#ff5858ff",
        crate::models::TagType::UserTag,
    )
    .await
    .map_err(|e| CreateMemberError::UnexpectedError(anyhow!(e)))?;

    let all_tag = services::get_all_tag(pool, split_id)
        .await
        .map_err(|e| CreateMemberError::UnexpectedError(anyhow!(e)))?;

    services::add_tag_to_member(pool, split_id, member.id, member_tag.id)
        .await
        .map_err(CreateMemberError::UnexpectedError)?;

    services::add_tag_to_member(pool, split_id, member.id, all_tag.id)
        .await
        .map_err(CreateMemberError::UnexpectedError)?;

    Ok(Member::from(member, vec![all_tag, member_tag]))
}

pub async fn get_member(pool: &PgPool, split_id: Uuid, member_id: Uuid) -> Result<Member> {
    let member = sqlx::query_as!(
        MemberDb,
        "
        SELECT id, public_id, name, split_id, type AS \"type: MemberType\", created_at, updated_at
        FROM split_members
        WHERE split_id = $1 AND id = $2
        ",
        split_id,
        member_id
    )
    .fetch_one(pool)
    .await
    .map_err(|e| match e {
        sqlx::Error::RowNotFound => anyhow!("Member not found"),
        _ => anyhow!("Failed to get member: {}", e),
    })?;

    let tags = services::get_tags_for_member(pool, split_id, member_id).await?;

    Ok(Member::from(member, tags))
}

pub async fn edit_member(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
    name: String,
) -> Result<Member> {
    let _member = sqlx::query_as!(
        MemberDb,
        "
        UPDATE split_members
        SET name = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING id, public_id, name, split_id, type AS \"type: MemberType\", created_at, updated_at
        ",
        member_id,
        name
    )
    .fetch_one(pool)
    .await
    .map_err(|e| {
        match e {
            sqlx::Error::Database(err) if err.constraint() == Some("split_members_split_id_name_key") => {
                anyhow!("Duplicate member name")
            }
            sqlx::Error::Database(err) if err.constraint().is_some() => {
                anyhow!("Unexpected error: {}", err.constraint().unwrap())
            }
            _ => anyhow!("Failed to edit member: {}", e),
        }
    })?;

    let tags = get_tags_for_member(pool, split_id, member_id);
    let member_tag = tags
        .await
        .map_err(|e| anyhow!("Failed to get member tags: {}", e))?
        .into_iter()
        .find(|tag| tag.r#type == TagType::UserTag)
        .ok_or_else(|| anyhow!("Member tag not found"))?;

    services::edit_tag(pool, split_id, member_tag.id, &name, &member_tag.color)
        .await
        .map_err(|e| anyhow!("Failed to edit member tag: {}", e))?;

    get_member(pool, split_id, member_id).await
}

pub async fn delete_member(pool: &PgPool, member_id: &Uuid) -> Result<()> {
    let query_result = sqlx::query!("DELETE FROM split_members WHERE id = $1", member_id)
        .execute(pool)
        .await;

    match query_result {
        Ok(_) => Ok(()),
        Err(e) => Err(anyhow!("Failed to delete member: {}", e)),
    }
}

pub async fn get_member_amount_spent(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<BigDecimal> {
    let query_result = sqlx::query!(
        "
        SELECT COALESCE(expenses, 0) AS expenses
        FROM member_expenses_view
        WHERE split_id = $1 AND member_id = $2
        ",
        split_id,
        member_id
    )
    .fetch_optional(pool)
    .await;

    match query_result {
        Ok(Some(result)) => Ok(result.expenses.unwrap()),
        Ok(None) => Ok(BigDecimal::from(0)),
        Err(e) => Err(anyhow!("Failed to get member expenses: {}", e)),
    }
}

pub async fn get_member_share(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<BigDecimal> {
    sqlx::query!(
        "
        SELECT COALESCE(income, 0) AS share
        FROM member_income_view
        WHERE split_id = $1 AND member_id = $2
        ",
        split_id,
        member_id
    )
    .fetch_optional(pool)
    .await
    .map(|opt| match opt {
        Some(result) => result.share.unwrap_or_else(|| BigDecimal::from(0)),
        None => BigDecimal::from(0),
    })
    .map_err(|e| anyhow!("Failed to get member share: {}", e))
}
