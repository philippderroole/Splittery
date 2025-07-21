"use server";

import { PUT } from "@/utils/request";
import { EditTagDto, Tag } from "@/utils/tag";

export async function editTag(
    splitId: string,
    tagId: string,
    tag: EditTagDto
): Promise<Tag> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/tags/${tagId}`,
        {
            body: JSON.stringify(tag),
        }
    );
}
