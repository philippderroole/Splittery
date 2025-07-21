"use server";

import { PUT } from "@/utils/request";
import { Transaction, UpdateTransaction } from "@/utils/transaction";

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
