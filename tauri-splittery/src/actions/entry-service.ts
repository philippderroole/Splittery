import { CreateEntryDto, EditEntityDto, SerializedEntry } from "../utils/entry";
import { DELETE, POST, PUT } from "../utils/request";

const apiUrl = import.meta.env.VITE_API_URL;

export async function createEntry(
    splitId: string,
    transactionId: string,
    transactionItem: CreateEntryDto,
): Promise<SerializedEntry> {
    return await POST(
        `${apiUrl}/splits/${splitId}/transactions/${transactionId}/entries`,
        {
            body: JSON.stringify(transactionItem),
        },
    );
}

export async function updateEntry(
    splitId: string,
    transactionId: string,
    entry: EditEntityDto,
): Promise<SerializedEntry> {
    return await PUT(
        `${apiUrl}/splits/${splitId}/transactions/${transactionId}/entries/${entry.id}`,
        {
            body: JSON.stringify(entry),
        },
    );
}

export async function deleteEntry(
    splitId: string,
    transactionId: string,
    entryId: string,
): Promise<void> {
    await DELETE(
        `${apiUrl}/splits/${splitId}/transactions/${transactionId}/entries/${entryId}`,
    );
}
