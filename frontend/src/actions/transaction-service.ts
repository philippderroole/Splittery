"use server";

import { DELETE, POST, PUT } from "@/utils/request";
import {
    CreateTransactionDto,
    SerializedTransaction,
    Transaction,
    UpdateTransaction,
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

export async function updateTransaction(
    transaction: UpdateTransaction,
    splitId: string
): Promise<Transaction> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transaction.url}`,
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
