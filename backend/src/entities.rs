use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Metadata {
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub is_deleted: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Activity {
    pub metadata: Option<Metadata>,
    pub id: Option<String>,
    pub user_ids: Option<Vec<String>>,
    pub expenses: Option<Vec<Expense>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Expense {
    pub metadata: Option<Metadata>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub amount: Option<f64>,
    pub user: Option<User>,
    pub balances: Option<Vec<Balance>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct Balance {
    pub metadata: Option<Metadata>,
    pub is_selected: Option<bool>,
    pub amount: Option<f64>,
    pub share: Option<f64>,
    pub user: Option<User>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct User {
    pub metadata: Option<Metadata>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub activity_ids: Option<Vec<String>>,
}
