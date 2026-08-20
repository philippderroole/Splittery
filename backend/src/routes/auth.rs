use axum::routing::get;
use axum::{Router, middleware, routing::post};
use sqlx::PgPool;

use crate::middleware::token_validation::validate_access_token_for_refresh;
use crate::{controllers, middleware::token_validation::validate_access_token};

pub fn auth_routes() -> Router<PgPool> {
    let protected_routes = Router::new()
        .nest(
            "/auth",
            Router::new()
                .nest(
                    "/password",
                    Router::new()
                        .route("/change", post(controllers::change_password))
                        .route("/reset", post(controllers::reset_password)),
                )
                .nest(
                    "/oidc/google",
                    Router::new()
                        .route("/finish", post(controllers::finish_oidc_auth))
                        .route("/link", post(controllers::link_oidc_account)),
                )
                .route("/web/logout", post(controllers::web_logout))
                .route("/tauri/logout", post(controllers::tauri_logout))
                .route("/me", get(controllers::me)),
        )
        .layer(middleware::from_fn(validate_access_token));

    let public_routes = Router::new()
        .nest(
            "/auth/tauri/password",
            Router::new()
                .route("/login", post(controllers::password_tauri_login))
                .route("/register", post(controllers::password_tauri_register)),
        )
        .nest(
            "/auth/web/password",
            Router::new()
                .route("/login", post(controllers::password_web_login))
                .route("/register", post(controllers::password_web_register)),
        )
        .route("/auth/anonymous", post(controllers::anonymous_auth));

    let refresh_routes = Router::new()
        .route("/auth/refresh", post(controllers::refresh_token))
        .layer(middleware::from_fn(validate_access_token_for_refresh));

    Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .merge(refresh_routes)
}
