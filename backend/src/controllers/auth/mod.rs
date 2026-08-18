mod anonymous;
mod login;
pub use anonymous::*;
mod logout;
mod refresh;
mod register;

pub use login::*;
pub use logout::*;
pub use refresh::*;
pub use register::*;

pub async fn change_password() {}

pub async fn reset_password() {}

pub async fn finish_oidc_auth() {}

pub async fn link_oidc_account() {}
