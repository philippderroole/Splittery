import { POST } from "@/utils/request";
import { CreateTagDto, Tag } from "@/utils/tag";

export async function createTag(
    splitId: string,
    tag: CreateTagDto
): Promise<Tag> {
    return await POST(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/tags`, {
        body: JSON.stringify(tag),
    });
}
