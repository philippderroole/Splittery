use chrono::Utc;
use jsonwebtoken::{EncodingKey, Header, encode};

use crate::middleware::jwt::Claims;

pub struct AccessToken {
    pub token: String,
}

impl AccessToken {
    pub fn generate(sid: String, user_id: String) -> anyhow::Result<AccessToken> {
        let key = dotenvy::var("JWT_SECRET")?;

        let now = Utc::now();

        let access_token = encode(
            &Header::default(),
            &Claims {
                sub: user_id,
                sid: sid,
                iat: now.timestamp(),
                exp: (now + chrono::Duration::hours(1)).timestamp(),
            },
            &EncodingKey::from_secret(key.as_ref()),
        )
        .map_err(|e| anyhow::anyhow!("Failed to generate access token: {}", e))?;

        Ok(AccessToken {
            token: access_token,
        })
    }
}
