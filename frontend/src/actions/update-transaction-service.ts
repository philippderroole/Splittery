"use server";

import { Transaction, UpdateTransaction } from "@/utils/transaction";
import { revalidatePath } from "next/cache";

export async function updateTransaction(
    transaction: UpdateTransaction,
    splitId: string
): Promise<Transaction> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transaction.url}`,
        {
            method: "PUT",
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
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transaction.url}`
    );

    return res.json();
}
