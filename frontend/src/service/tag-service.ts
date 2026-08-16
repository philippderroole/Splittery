import { GET } from "@/utils/request";
import { Tag } from "@/utils/tag";

export async function getTags(splitId: string): Promise<Tag[]> {
    return await GET(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/tags`);
}
