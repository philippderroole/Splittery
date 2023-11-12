use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct MetadataDto {
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub is_deleted: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ActivityDto {
    pub metadata: Option<MetadataDto>,
    pub id: Option<String>,
    pub user_ids: Option<Vec<String>>,
    pub expense_ids: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct ExpenseDto {
    pub metadata: Option<MetadataDto>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub amount: Option<f64>,
    pub user_id: Option<String>,
    pub balance_ids: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct BalanceDto {
    pub metadata: Option<MetadataDto>,
    pub id: Option<String>,
    pub is_selected: Option<bool>,
    pub amount: Option<f64>,
    pub share: Option<f64>,
    pub user_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub struct UserDto {
    pub metadata: Option<MetadataDto>,
    pub id: Option<String>,
    pub name: Option<String>,
    pub activity_ids: Option<Vec<String>>,
}
