mod login;
mod logout;
mod refresh;
mod register;

use axum_extra::extract::cookie::{Cookie, SameSite};
use cookie::{CookieBuilder, time::Duration};
pub use login::*;
pub use logout::*;
pub use refresh::*;
pub use register::*;

use crate::services::{RefreshToken, access_token::AccessToken};

pub async fn change_password() {}

pub async fn reset_password() {}

pub async fn finish_oidc_auth() {}

pub async fn link_oidc_account() {}

pub fn refresh_cookie_builder(refresh_token: RefreshToken) -> CookieBuilder<'static> {
    Cookie::build(("refresh_token", refresh_token.token))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .path("/api/v1/auth/refresh")
        .max_age(Duration::days(30))
}

pub fn access_cookie_builder(access_token: AccessToken) -> CookieBuilder<'static> {
    Cookie::build(("access_token", access_token.token))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .path("/api/v1")
        .max_age(Duration::minutes(15))
}
