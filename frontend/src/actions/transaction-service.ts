"use server";

import { DELETE, POST, PUT } from "@/utils/request";
import {
    CreateTransactionDto,
    SerializedTransaction,
    Transaction,
    UpdateTransactionDto,
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
    splitId: string,
    transaction: UpdateTransactionDto
): Promise<Transaction> {
    return await PUT(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions/${transaction.id}`,
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
