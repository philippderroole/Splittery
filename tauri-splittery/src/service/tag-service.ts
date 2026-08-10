import { GET } from "../utils/request";
import { Tag } from "../utils/tag";

export async function getTags(splitId: string): Promise<Tag[]> {
    const apiUrl = import.meta.env.VITE_API_URL;

    return await GET(`${apiUrl}/splits/${splitId}/tags`);
}
