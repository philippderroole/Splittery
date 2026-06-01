use argon2::{
    Argon2, PasswordHasher,
    password_hash::{SaltString, rand_core::OsRng},
};
use chrono::{DateTime, Duration, Utc};
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
            token_expires_at: Utc::now() + Duration::days(30),
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
}
