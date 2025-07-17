"use server";

import {
    SerializedTransactionItem,
    UpdateTransactionItem,
} from "@/utils/transaction-item";
import { revalidatePath } from "next/cache";

export async function updateTransactionItem(
    transactionItem: UpdateTransactionItem,
    splitId: string,
    transactionId: string
): Promise<SerializedTransactionItem> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transactionId}/items/${transactionItem.url}`,
        {
            method: "PUT",
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
