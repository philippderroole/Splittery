import "server-only";

import { SerializedTransaction } from "@/utils/transaction";

export async function getTransactions(
    splitId: string
): Promise<SerializedTransaction[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions`,
        {
            method: "GET",
            //cache: "force-cache",
        }
    );

    console.debug(
        "Fetching transactions for splitId:",
        splitId,
        "URL:",
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch transaction groups");
    }

    return res.json();
}

export async function getTransaction(
    splitId: string,
    transactionId: string
): Promise<SerializedTransaction> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transactionId}`,
        {
            method: "GET",
            //cache: "force-cache",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch transaction group");
    }

    return await res.json();
}
