use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

#[derive(Serialize)]
pub struct ErrorResponse {
    pub status: Status,
    pub message: String,
}

#[derive(Serialize)]
pub enum Status {
    #[serde(rename = "success")]
    Success,
    #[serde(rename = "error")]
    Error,
}

pub struct AppError(pub StatusCode, pub Option<anyhow::Error>);

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            self.0,
            Json(ErrorResponse {
                status: Status::Error,
                message: self
                    .1
                    .unwrap_or(anyhow::anyhow!("An unexpected error occurred"))
                    .to_string(),
            }),
        )
            .into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(StatusCode::INTERNAL_SERVER_ERROR, Some(err.into()))
    }
}

impl ErrorResponse {
    pub fn new(status: StatusCode, message: String) -> Self {
        Self {
            status: Status::Error,
            message,
        }
    }

    pub fn from(status: StatusCode) -> Self {
        Self {
            status: Status::Error,
            message: "An unexpected error occurred".to_string(),
        }
    }
}
