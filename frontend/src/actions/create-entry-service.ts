"use server";

import { CreateEntryDto, SerializedEntry } from "@/utils/entry";
import { POST } from "@/utils/request";

export async function createEntry(
    splitId: string,
    transactionId: string,
    transactionItem: CreateEntryDto
): Promise<SerializedEntry> {
    return await POST(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/entries`,
        {
            body: JSON.stringify(transactionItem),
        }
    );
}
