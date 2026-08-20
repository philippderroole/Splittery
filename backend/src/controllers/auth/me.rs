use axum::http::StatusCode;

#[axum::debug_handler]
pub async fn me() -> anyhow::Result<(), StatusCode> {
    Ok(())
}
