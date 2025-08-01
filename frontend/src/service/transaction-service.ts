import "server-only";

import { Entry } from "@/utils/entry";
import { GET } from "@/utils/request";
import { SerializedTransaction } from "@/utils/transaction";

export async function getTransactions(
    splitId: string
): Promise<SerializedTransaction[]> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions`
    );
}

export async function getEntriesForTransaction(
    splitId: string,
    transactionId: string
): Promise<Entry[]> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/entries`
    );
}
