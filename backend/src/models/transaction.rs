use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, sqlx::FromRow, Serialize, Deserialize)]
pub struct TransactionEntry {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub amount: i64, // Amount in cents
    pub transaction_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, sqlx::FromRow, Serialize, Deserialize)]
pub struct Transaction {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub amount: i64, // Amount in cents
    pub split_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, sqlx::FromRow, Serialize, Deserialize)]
pub struct Tag {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub color: String,
    pub split_id: Uuid,
    pub is_custom: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
