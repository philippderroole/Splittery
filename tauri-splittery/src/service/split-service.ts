import { invoke } from "@tauri-apps/api/core";

export async function getSplit(splitId: string) {
    return invoke("get_split", { splitId });
}
