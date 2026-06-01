use chrono::{DateTime, Utc};

pub struct Session {
    pub id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub client_type: String,
    pub refresh_token_hash: Vec<u8>,
    pub refresh_token_expires_at: DateTime<Utc>,
    pub device_id: Option<String>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub last_seen_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}
