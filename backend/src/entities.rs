use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Metadata {
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub is_deleted: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Activity {
    pub metadata: Metadata,
    pub id: String,
    pub user_ids: Vec<String>,
    pub expense_ids: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Expense {
    pub metadata: Metadata,
    pub id: String,
    pub name: String,
    pub amount: f64,
    pub user_id: String,
    pub balance_ids: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Balance {
    pub metadata: Metadata,
    pub id: String,
    pub is_selected: bool,
    pub amount: f64,
    pub share: f64,
    pub user_id: String,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct User {
    pub metadata: Metadata,
    pub id: String,
    pub name: String,
    pub activity_ids: Option<Vec<String>>,
}
