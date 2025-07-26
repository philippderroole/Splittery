use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::Type;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, Type, PartialEq, Eq, Hash)]
#[sqlx(type_name = "tag_type", rename_all = "lowercase")]
pub enum TagType {
    AllTag,
    UserTag,
    CustomTag,
}

#[derive(Debug, Clone, sqlx::FromRow)]
pub struct TagDb {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub color: String,
    pub split_id: Uuid,
    pub r#type: TagType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct Tag {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub color: String,
    pub split_id: Uuid,
    pub r#type: TagType,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl Tag {
    pub fn from(db_tag: TagDb) -> Self {
        Self {
            id: db_tag.id,
            public_id: db_tag.public_id,
            name: db_tag.name,
            color: db_tag.color,
            split_id: db_tag.split_id,
            r#type: db_tag.r#type,
            created_at: db_tag.created_at,
            updated_at: db_tag.updated_at,
        }
    }
}
