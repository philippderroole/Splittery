use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::Tag;

#[derive(Debug, Clone, sqlx::FromRow, Serialize, Deserialize)]
pub struct EntryDb {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub amount: i64, // Amount in cents
    pub transaction_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct Entry {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub amount: i64, // Amount in cents
    pub transaction_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub tags: Vec<Tag>,
}

impl Entry {
    pub fn from(db_entry: EntryDb, tags: Vec<Tag>) -> Self {
        Self {
            id: db_entry.id,
            public_id: db_entry.public_id,
            name: db_entry.name,
            amount: db_entry.amount,
            transaction_id: db_entry.transaction_id,
            created_at: db_entry.created_at,
            updated_at: db_entry.updated_at,
            tags,
        }
    }
}

#[derive(Debug, Clone, sqlx::FromRow, Serialize, Deserialize)]
pub struct TransactionDb {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub amount: i64, // Amount in cents
    pub member_id: Uuid,
    pub split_id: Uuid,
    pub executed_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct Transaction {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub amount: i64, // Amount in cents
    pub member_id: Uuid,
    pub split_id: Uuid,
    pub executed_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub entries: Vec<Entry>,
    pub tags: Vec<Tag>,
}

impl Transaction {
    pub fn from(db_transaction: TransactionDb, tags: Vec<Tag>, entries: Vec<Entry>) -> Self {
        Self {
            id: db_transaction.id,
            public_id: db_transaction.public_id,
            name: db_transaction.name,
            amount: db_transaction.amount,
            member_id: db_transaction.member_id,
            split_id: db_transaction.split_id,
            executed_at: db_transaction.executed_at,
            created_at: db_transaction.created_at,
            updated_at: db_transaction.updated_at,
            entries,
            tags,
        }
    }
}
