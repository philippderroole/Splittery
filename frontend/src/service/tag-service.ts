import "server-only";

import { GET } from "@/utils/request";
import { Tag } from "@/utils/tag";

export async function getTags(splitId: string): Promise<Tag[]> {
    return await GET(`${process.env.INTERNAL_API_URL}/splits/${splitId}/tags`);
}
