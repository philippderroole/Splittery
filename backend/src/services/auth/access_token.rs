use chrono::Utc;
use cookie::{Cookie, SameSite};
use jsonwebtoken::{EncodingKey, Header, encode};

use crate::middleware::jwt::Claims;

pub struct AccessToken {
    pub token: String,
    pub token_expires_at: chrono::DateTime<Utc>,
}

impl AccessToken {
    pub fn generate(sid: String, user_id: String) -> anyhow::Result<AccessToken> {
        let key = dotenvy::var("JWT_SECRET")?;

        let now = Utc::now();
        let exp = now + chrono::Duration::minutes(10);

        let access_token = encode(
            &Header::default(),
            &Claims {
                sub: user_id,
                sid: sid,
                iat: now.timestamp(),
                exp: exp.timestamp(),
            },
            &EncodingKey::from_secret(key.as_ref()),
        )
        .map_err(|e| anyhow::anyhow!("Failed to generate access token: {}", e))?;

        Ok(AccessToken {
            token: access_token,
            token_expires_at: exp,
        })
    }

    pub fn expired() -> AccessToken {
        AccessToken {
            token: String::new(),
            token_expires_at: Utc::now() - chrono::Duration::days(1),
        }
    }
}

impl From<AccessToken> for Cookie<'static> {
    fn from(access_token: AccessToken) -> Self {
        Cookie::build(("access_token", access_token.token))
            .http_only(true)
            .secure(true)
            .same_site(SameSite::Strict)
            .path("/api/v1/")
            .max_age(cookie::time::Duration::seconds(
                access_token
                    .token_expires_at
                    .signed_duration_since(Utc::now())
                    .num_seconds(),
            ))
            .build()
    }
}
