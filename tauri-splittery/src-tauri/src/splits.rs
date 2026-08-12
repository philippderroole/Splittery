use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_http::reqwest::Client;
use tauri_plugin_keyring_store::KeyringExt;

#[derive(Deserialize, Serialize)]
pub struct Split {
    pub id: String,
    pub name: String,
}
#[tauri::command]
pub async fn get_splits(app: AppHandle) -> Result<Vec<Split>, String> {
    let access_token = app
        .keyring()
        .store
        .get_password("access_token")
        .map_err(|e| e.to_string())?
        .ok_or("Access token not found")?;

    let client = Client::new();
    let res = client
        .get("http://127.0.0.1:8000/api/v1/splits")
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let splits = res.json().await.map_err(|e| e.to_string())?;

    Ok(splits)
}

#[tauri::command]
pub async fn create_split(app: AppHandle, split: Split) -> Result<Split, String> {
    let access_token = app
        .keyring()
        .store
        .get_password("access_token")
        .map_err(|e| e.to_string())?
        .ok_or("Access token not found")?;

    let client = Client::new();
    let res = client
        .post("http://127.0.0.1:8000/api/v1/splits")
        .header("Authorization", format!("Bearer {}", access_token))
        .json(&split)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let created_split = res.json().await.map_err(|e| e.to_string())?;

    Ok(created_split)
}
