import { TransactionGroup } from "@/utils/transaction-group";

export async function getTransactionGroups(
    splitId: string
): Promise<TransactionGroup[]> {
    return await fetch(
        `${process.env.API_URL}/splits/${splitId}/transactions`,
        {
            cache: "force-cache",
        }
    ).then((res) => {
        console.log("Fetching transaction groups for split:", splitId);
        console.log(res);

        if (!res.ok) {
            throw new Error("Failed to fetch transaction groups");
        }
        return res.json();
    });
}

export async function getTransactionGroup(
    splitId: string,
    transactionUrl: string
): Promise<TransactionGroup> {
    return await fetch(
        `${process.env.API_URL}/splits/${splitId}/transactions/${transactionUrl}`,
        {
            cache: "force-cache",
        }
    ).then((res) => {
        console.log(res);

        if (!res.ok) {
            throw new Error("Failed to fetch transaction group");
        }
        return res.json();
    });
}
