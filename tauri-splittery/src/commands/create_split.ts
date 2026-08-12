import { invoke } from "@tauri-apps/api/core";
import { CreateSplitDto, Split } from "../utils/split";

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await invoke("create_split", { split });
}
