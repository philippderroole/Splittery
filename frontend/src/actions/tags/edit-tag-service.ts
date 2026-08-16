import { PUT } from "@/utils/request";
import { EditTagDto, Tag } from "@/utils/tag";

export async function editTag(
    splitId: string,
    tagId: string,
    tag: EditTagDto
): Promise<Tag> {
    return await PUT(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/tags/${tagId}`, {
        body: JSON.stringify(tag),
    });
}
