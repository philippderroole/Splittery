"use server";

import { CreateTransaction, SerializedTransaction } from "@/utils/transaction";
import { revalidatePath } from "next/cache";

export async function createTransaction(
    transaction: CreateTransaction,
    splitId: string
): Promise<SerializedTransaction> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions`
    );

    return res.json();
}
