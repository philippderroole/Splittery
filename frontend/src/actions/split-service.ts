"use server";

import { POST } from "@/utils/request";
import { CreateSplitDto, Split } from "@/utils/split";

export async function createSplit(split: CreateSplitDto): Promise<Split> {
    return await POST(`${process.env.INTERNAL_API_URL}/splits`, {
        body: JSON.stringify(split),
    });
}
