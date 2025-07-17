"use server";

import {
    CreateTransactionItem,
    SerializedTransactionItem,
} from "@/utils/transaction-item";
import { revalidatePath } from "next/cache";

export async function createTransactionItem(
    transactionItem: CreateTransactionItem,
    splitId: string,
    transactionId: string
): Promise<SerializedTransactionItem> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transactionId}/items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionItem),
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
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transactionId}`
    );

    return res.json();
}
