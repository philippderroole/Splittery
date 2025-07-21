import "server-only";

import { TransactionEntry } from "@/utils/entry";
import { GET } from "@/utils/request";
import { SerializedTransaction } from "@/utils/transaction";

export async function getTransactions(
    splitId: string
): Promise<SerializedTransaction[]> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions`
    );
}

export async function getTransaction(
    splitId: string,
    transactionId: string
): Promise<SerializedTransaction> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}`
    );
}

export async function getEntriesForTransaction(
    splitId: string,
    transactionId: string
): Promise<TransactionEntry[]> {
    return await GET(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}/entries`
    );
}
