use axum::{Router, middleware, routing::post};
use sqlx::PgPool;

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
                .route("/logout", post(controllers::logout)),
        )
        .layer(middleware::from_fn(validate_access_token));

    let public_routes = Router::new().nest(
        "/auth",
        Router::new()
            .nest(
                "/password",
                Router::new()
                    .route("/register", post(controllers::register_user))
                    .route("/login", post(controllers::login_user)),
            )
            .route("/refresh", post(controllers::refresh_token)),
    );

    Router::new().merge(public_routes).merge(protected_routes)
}
