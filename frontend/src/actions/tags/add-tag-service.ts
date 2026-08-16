import { PUT } from "@/utils/request";
import { Tag } from "@/utils/tag";

export async function addTagsToTransaction(
    splitId: string,
    transactionId: string,
    tags: Tag[]
): Promise<Tag> {
    return await PUT(`${import.meta.env.VITE_INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/tags`, {
        body: JSON.stringify(tags),
    });
}
