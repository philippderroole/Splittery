use anyhow::Result;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
fn main() -> Result<()> {
    dotenvy::dotenv()?;

    tauri_splittery_lib::run();

    Ok(())
}
