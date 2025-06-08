import { SerializedTransaction } from "@/utils/transaction";
import "server-only";

export async function getTransactionGroups(
    splitId: string
): Promise<SerializedTransaction[]> {
    return await fetch(
        `${process.env.API_URL}/splits/${splitId}/transactions`
    ).then((res) => {
        console.log("Fetching transaction groups for split:", splitId);
        console.log(res);

        if (!res.ok) {
            throw new Error("Failed to fetch transaction groups");
        }
        return res.json();
    });
}

export async function getTransaction(
    splitId: string,
    transactionUrl: string
): Promise<SerializedTransaction> {
    const res = await fetch(
        `${process.env.API_URL}/splits/${splitId}/transactions/${transactionUrl}`,
        {
            cache: "force-cache",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch transaction group");
    }

    return await res.json();
}
