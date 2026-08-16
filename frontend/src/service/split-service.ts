import "server-only";

import { GET, POST } from "@/utils/request";
import { CreateSplitDto, Split } from "@/utils/split";

export async function getSplit(splitId: string): Promise<Split> {
    return await GET(`${process.env.INTERNAL_API_URL}/splits/${splitId}`);
}

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await POST(`${process.env.INTERNAL_API_URL}/splits`, {
        body: JSON.stringify(split),
    });
}
