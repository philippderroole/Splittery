"use server";

import { Transaction } from "@/utils/transaction";
import { CreateTransactionItem } from "@/utils/transaction-item";
import { revalidatePath } from "next/cache";

export async function createTransactionItem(
    transaction: CreateTransactionItem,
    splitId: string
): Promise<Transaction> {
    const res = await fetch(
        `${process.env.API_URL}/splits/${splitId}/transactions/${transaction.transactionId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transaction),
        }
    );

    if (!res.ok) {
        let errorMsg = res.statusText;
        try {
            const data = await res.json();
            if (data?.message) {
                errorMsg = data.message;
            } else if (typeof data === "string") {
                errorMsg = data;
            }
        } catch {
            // ignore JSON parse errors, fallback to statusText
        }
        throw new Error(errorMsg);
    }

    revalidatePath(
        `${process.env.API_URL}/splits/${splitId}/transactions/${transaction.transactionId}`
    );

    return res.json();
}
