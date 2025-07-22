use std::fmt;

use crate::models::{MemberType, SplitMember};
use crate::services::add_tag_to_member;
use crate::services::{self, GetTagError};
use anyhow::Result;
use anyhow::anyhow;
use bigdecimal::BigDecimal;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn get_all_members(pool: &PgPool, split_id: Uuid) -> Result<Vec<SplitMember>> {
    sqlx::query_as!(
        SplitMember,
        "
        SELECT id, public_id, name, split_id, type AS \"type: MemberType\", created_at, updated_at
        FROM split_members
        WHERE split_id = $1
        ",
        split_id
    )
    .fetch_all(pool)
    .await
    .map_err(|e| anyhow!("Failed to get members: {}", e))
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
) -> Result<SplitMember, CreateMemberError> {
    let member_id = Uuid::new_v4();
    let member = sqlx::query_as!(
        SplitMember,
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

    let tag = services::get_all_tag(pool, split_id)
        .await
        .map_err(|e| match e {
            GetTagError::NotFound => {
                CreateMemberError::UnexpectedError(anyhow!("Predefined tag 'all' not found"))
            }
            GetTagError::PredefinedTagNotFound => {
                CreateMemberError::UnexpectedError(anyhow!("Predefined tag 'all' not found"))
            }
            GetTagError::UnexpectedError(e) => CreateMemberError::UnexpectedError(e),
        })?;

    add_tag_to_member(pool, split_id, member_id, tag.id)
        .await
        .map_err(CreateMemberError::UnexpectedError)?;

    Ok(member)
}

pub async fn get_member(pool: &PgPool, split_id: Uuid, member_id: Uuid) -> Result<SplitMember> {
    let query_result = sqlx::query_as!(
        SplitMember,
        "
        SELECT id, public_id, name, split_id, type AS \"type: MemberType\", created_at, updated_at
        FROM split_members
        WHERE split_id = $1 AND id = $2
        ",
        split_id,
        member_id
    )
    .fetch_one(pool)
    .await;

    match query_result {
        Ok(member) => Ok(member),
        Err(e) => Err(anyhow!("Failed to get member: {}", e)),
    }
}

pub async fn edit_member(pool: &PgPool, member_id: Uuid, name: String) -> Result<SplitMember> {
    sqlx::query_as!(
        SplitMember,
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
    })
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

pub async fn get_member_balance(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<BigDecimal> {
    let expenses = get_member_expenses(pool, split_id, member_id).await?;
    let income = get_member_income(pool, split_id, member_id).await?;

    let balance = income - expenses;

    Ok(balance)
}

pub async fn get_member_expenses(
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

pub async fn get_member_income(
    pool: &PgPool,
    split_id: Uuid,
    member_id: Uuid,
) -> Result<BigDecimal> {
    let query_result = sqlx::query!(
        "
    SELECT COALESCE(income, 0) AS income
    FROM member_income_view
    WHERE split_id = $1 AND member_id = $2
    ",
        split_id,
        member_id
    )
    .fetch_optional(pool)
    .await;

    match query_result {
        Ok(Some(result)) => Ok(result.income.unwrap()),
        Ok(None) => Ok(BigDecimal::from(0)),
        Err(e) => Err(anyhow!("Failed to get member income: {}", e)),
    }
}
