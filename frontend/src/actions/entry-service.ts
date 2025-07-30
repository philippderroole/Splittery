"use server";

import { CreateEntryDto, EditEntityDto, SerializedEntry } from "@/utils/entry";
import { DELETE, POST, PUT } from "@/utils/request";

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

export async function editEntry(
    splitId: string,
    transactionId: string,
    entry: EditEntityDto
): Promise<SerializedEntry> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/entries/${entry.id}`,
        {
            body: JSON.stringify(entry),
        }
    );
}

export async function deleteEntry(
    splitId: string,
    transactionId: string,
    entryId: string
): Promise<void> {
    await DELETE(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/entries/${entryId}`
    );
}
