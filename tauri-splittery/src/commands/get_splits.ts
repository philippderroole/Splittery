import { invoke } from "@tauri-apps/api/core";

export async function getSplits() {
    return invoke("get_splits");
}
