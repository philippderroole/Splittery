"use server";

import { SerializedEntry, UpdateEntityDto } from "@/utils/entry";
import { PUT } from "@/utils/request";

export async function updateTransactionItem(
    transactionItem: UpdateEntityDto,
    splitId: string,
    transactionId: string
): Promise<SerializedEntry> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/items/${transactionItem.url}`,
        {
            body: JSON.stringify(transactionItem),
        }
    );
}
