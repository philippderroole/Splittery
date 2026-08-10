"use server";

import { DELETE } from "@/utils/request";

export async function deleteTag(splitId: string, tagId: string): Promise<void> {
    return await DELETE(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/tags/${tagId}`
    );
}
