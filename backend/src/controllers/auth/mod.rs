mod anonymous;
mod change_password;
mod login;
mod logout;
mod me;
mod refresh;
mod register;

pub use anonymous::*;
pub use change_password::*;
pub use login::*;
pub use logout::*;
pub use me::*;
pub use refresh::*;
pub use register::*;

pub async fn reset_password() {}

pub async fn finish_oidc_auth() {}

pub async fn link_oidc_account() {}
