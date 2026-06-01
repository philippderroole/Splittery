import { fetch } from '@tauri-apps/plugin-http';

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn register(username: &str, password: &str) -> String {
    let api_url = dotenvy::env("API_URL").unwrap();

    const response = await fetch(format!("{}/users", api_url), {method: "POST", body: JSON.stringify({ username, password })});

    format!("User '{}' registered successfully!", username)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
