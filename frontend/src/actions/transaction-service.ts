"use server";

import { DELETE, POST } from "@/utils/request";
import {
    CreateTransactionDto,
    SerializedTransaction,
} from "@/utils/transaction";

export async function createTransaction(
    splitId: string,
    transaction: CreateTransactionDto
): Promise<SerializedTransaction> {
    return await POST(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions`,
        {
            body: JSON.stringify(transaction),
        }
    );
}

export async function deleteTransaction(
    splitId: string,
    transactionId: string
): Promise<void> {
    await DELETE(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transactionId}`
    );
}
