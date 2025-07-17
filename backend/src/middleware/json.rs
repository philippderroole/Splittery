use crate::responses::error::Status;
use axum::{
    extract::{FromRequest, Request},
    http::StatusCode,
    response::Json,
};
use serde::de::DeserializeOwned;
use serde_json::{Value, json};

pub struct CustomJson<T>(pub T);

impl<S, T> FromRequest<S> for CustomJson<T>
where
    T: DeserializeOwned,
    S: Send + Sync,
{
    type Rejection = (StatusCode, Json<Value>);

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        match axum::Json::<T>::from_request(req, state).await {
            Ok(value) => Ok(Self(value.0)),
            Err(rejection) => Err((
                rejection.status(),
                Json(json!({
                    "status": Status::Error,
                    "message": rejection.body_text(),
                })),
            )),
        }
    }
}
