use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_http::reqwest::Client;
use tauri_plugin_keyring_store::KeyringExt;

#[derive(Serialize, Deserialize)]
pub struct LoginResponse {
    access_token: String,
    refresh_token: String,
}

#[tauri::command]
pub async fn login(app: AppHandle, email: String, password: String) -> anyhow::Result<(), String> {
    let client = Client::new();
    let res = client
        .post("http://127.0.0.1:8000/api/v1/auth/tauri/password/login")
        .header("Content-Type", "application/json")
        .body(format!(
            r#"{{"email": "{}", "password": "{}"}}"#,
            email, password
        ))
        .send()
        .await
        .unwrap()
        .json::<LoginResponse>()
        .await
        .unwrap();

    app.keyring()
        .store
        .set_password("access_token", &res.access_token)
        .map_err(|e| e.to_string())?;
    app.keyring()
        .store
        .set_password("refresh_token", &res.refresh_token)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn register(email: String, password: String) -> anyhow::Result<String, String> {
    let client = Client::new();
    let res = client
        .post("http://127.0.0.1:8000/api/v1/auth/tauri/password/register")
        .header("Content-Type", "application/json")
        .body(format!(
            r#"{{"email": "{}", "password": "{}"}}"#,
            email, password
        ))
        .send()
        .await
        .unwrap();

    let text = res.text().await.unwrap();
    Ok(text)
}
