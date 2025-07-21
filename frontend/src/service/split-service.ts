import "server-only";

import { GET } from "@/utils/request";

export async function getSplit(splitId: string) {
    return await GET(`${process.env.INTERNAL_API_URL}/splits/${splitId}`);
}
