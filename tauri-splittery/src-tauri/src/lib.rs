use tauri::{App, Manager};

mod auth;
mod splits;

use crate::auth::{login, register};
use crate::splits::get_splits;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_keyring_store::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                open_devtools(app);
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            login,
            register,
            get_splits,
            create_split
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(debug_assertions)]
fn open_devtools(app: &mut App) {
    let window = app.get_webview_window("main").unwrap();
    window.open_devtools();
    window.close_devtools();
}
