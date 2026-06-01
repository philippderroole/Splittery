use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub public_id: String,
    pub username: String,
    pub email: String,
    pub email_verified: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum IdentityProvider {
    Local,
    Google,
}

impl From<String> for IdentityProvider {
    fn from(provider_str: String) -> Self {
        match provider_str.to_lowercase().as_str() {
            "local" => IdentityProvider::Local,
            "google" => IdentityProvider::Google,
            _ => panic!("Unsupported identity provider: {}", provider_str),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserIdentity {
    pub id: Uuid,
    pub user_id: Uuid,
    pub provider: IdentityProvider,
    pub provider_subject: Option<String>,
    pub password_hash: Option<String>,
    pub created_at: DateTime<Utc>,
}
