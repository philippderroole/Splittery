import { GET, POST } from "@/utils/request";
import { CreateSplitDto, Split } from "@/utils/split";

export async function getSplits(): Promise<Split[]> {
    return await GET(`${import.meta.env.VITE_INTERNAL_API_URL}/splits`);
}

export async function getSplit(splitId: string): Promise<Split> {
    return await GET(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}`);
}

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await POST(`${import.meta.env.VITE_INTERNAL_API_URL}/splits`, {
        body: JSON.stringify(split),
    });
}
