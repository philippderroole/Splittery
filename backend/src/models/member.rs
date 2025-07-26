use chrono::{DateTime, Utc};
use sqlx::Type;
use uuid::Uuid;

use crate::models::Tag;

#[derive(Debug, Clone, Type, PartialEq, Eq, Hash)]
#[sqlx(type_name = "member_type", rename_all = "lowercase")]
pub enum MemberType {
    Registered,
    Guest,
}

#[derive(Debug, Clone, sqlx::FromRow, PartialEq, Eq, Hash)]
pub struct MemberDb {
    pub id: Uuid,
    pub public_id: String,
    pub split_id: Uuid,
    pub name: String,
    pub r#type: MemberType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Member {
    pub id: Uuid,
    pub public_id: String,
    pub split_id: Uuid,
    pub name: String,
    pub r#type: MemberType,
    pub tags: Vec<Tag>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Member {
    pub fn from(member_db: MemberDb, tags: Vec<Tag>) -> Self {
        Self {
            id: member_db.id,
            public_id: member_db.public_id,
            split_id: member_db.split_id,
            name: member_db.name,
            r#type: member_db.r#type,
            tags,
            created_at: member_db.created_at,
            updated_at: member_db.updated_at,
        }
    }
}
