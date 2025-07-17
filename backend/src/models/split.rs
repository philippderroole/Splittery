use chrono::{DateTime, Utc};
use sqlx::Type;
use uuid::Uuid;

#[derive(Debug, Clone, sqlx::FromRow)]
pub struct Split {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Type, PartialEq, Eq, Hash)]
#[sqlx(type_name = "member_type", rename_all = "lowercase")]
pub enum MemberType {
    Registered,
    Guest,
}

#[derive(Debug, Clone, sqlx::FromRow, PartialEq, Eq, Hash)]
pub struct SplitMember {
    pub id: Uuid,
    pub public_id: String,
    pub split_id: Uuid,
    pub name: String,
    pub r#type: MemberType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
