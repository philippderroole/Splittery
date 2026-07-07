mod login;
mod logout;
mod refresh;
mod register;

use axum_extra::extract::cookie::{Cookie, SameSite};
pub use login::*;
pub use logout::*;
pub use refresh::*;
pub use register::*;

use crate::services::RefreshToken;

pub async fn change_password() {}

pub async fn reset_password() {}

pub async fn finish_oidc_auth() {}

pub async fn link_oidc_account() {}

pub fn create_refresh_cookie(refresh_token: RefreshToken) -> Cookie<'static> {
    Cookie::build(("refresh_token", refresh_token.token))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .path("/api/v1/auth/refresh")
        .build()
}
