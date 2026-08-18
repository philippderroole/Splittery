use argon2::{
    Argon2, PasswordHasher,
    password_hash::{SaltString, rand_core::OsRng},
};
use chrono::{DateTime, Utc};
use cookie::{Cookie, SameSite};
use rand::{RngExt, distr::Alphanumeric};

pub struct RefreshToken {
    pub token: String,
    pub token_expires_at: DateTime<Utc>,
}

impl RefreshToken {
    pub fn generate() -> anyhow::Result<RefreshToken> {
        let refresh_token = rand::rng()
            .sample_iter(&Alphanumeric)
            .take(64)
            .map(char::from)
            .collect::<String>();

        Ok(RefreshToken {
            token: refresh_token,
            token_expires_at: Utc::now() + chrono::Duration::days(30),
        })
    }

    pub fn hash(&self) -> anyhow::Result<Vec<u8>> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();

        let password_hash = argon2
            .hash_password(self.token.as_bytes(), &salt)
            .map_err(|e| anyhow::anyhow!("Failed to hash refresh token: {}", e))?;

        Ok(password_hash.serialize().as_bytes().to_vec())
    }

    pub fn expired() -> RefreshToken {
        RefreshToken {
            token: String::new(),
            token_expires_at: Utc::now() - chrono::Duration::days(1),
        }
    }
}

impl From<RefreshToken> for Cookie<'static> {
    fn from(refresh_token: RefreshToken) -> Self {
        Cookie::build(("refresh_token", refresh_token.token))
            .http_only(true)
            .same_site(
                cfg!(debug_assertions)
                    .then(|| SameSite::Lax)
                    .unwrap_or(SameSite::None),
            )
            .secure(!cfg!(debug_assertions))
            .path("/api/v1/auth/refresh")
            .max_age(cookie::time::Duration::seconds(
                refresh_token
                    .token_expires_at
                    .signed_duration_since(Utc::now())
                    .num_seconds(),
            ))
            .build()
    }
}

impl From<RefreshToken> for String {
    fn from(refresh_token: RefreshToken) -> Self {
        refresh_token.token
    }
}
