import "server-only";

import { TransactionEntry } from "@/utils/entry";
import { SerializedTransaction } from "@/utils/transaction";

export async function getTransactions(
    splitId: string
): Promise<SerializedTransaction[]> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions`;

    console.debug("Fetching transactions from URL: ", url);

    const res = await fetch(url, {
        method: "GET",
        //cache: "force-cache",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch transaction groups");
    }

    const transactions = await res.json();

    console.debug("Fetched transactions: ", transactions);

    return transactions;
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

export async function getEntriesForTransaction(
    splitId: string,
    transactionId: string
): Promise<TransactionEntry[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitId}/transactions/${transactionId}/entries`,
        {
            method: "GET",
            //cache: "force-cache",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch entries for transaction");
    }

    return res.json();
}
