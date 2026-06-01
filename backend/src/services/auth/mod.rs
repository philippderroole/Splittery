use sqlx::PgPool;

mod login;
mod logout;
mod refresh;
pub mod refresh_token;
pub mod register;

pub use login::*;
pub use logout::*;
pub use refresh::*;
pub use refresh_token::*;
pub use register::*;

pub async fn change_password(pool: &PgPool) {}

pub async fn reset_password(pool: &PgPool) {}

pub async fn finish_oidc_auth(pool: &PgPool) {}

pub async fn link_oidc_account(pool: &PgPool) {}
