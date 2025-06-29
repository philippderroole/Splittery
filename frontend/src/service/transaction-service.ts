import { SerializedTransaction } from "@/utils/transaction";
import "server-only";

export async function getTransactions(
    splitUrl: string
): Promise<SerializedTransaction[]> {
    return await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitUrl}/transactions`,
        {
            //cache: "force-cache",
        }
    ).then((res) => {
        console.log("Fetching transaction groups for split:", splitUrl);
        console.log(res);

        if (!res.ok) {
            throw new Error("Failed to fetch transaction groups");
        }
        return res.json();
    });
}

export async function getTransaction(
    splitUrl: string,
    transactionUrl: string
): Promise<SerializedTransaction> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/splits/${splitUrl}/transactions/${transactionUrl}`,
        {
            //cache: "force-cache",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch transaction group");
    }

    return await res.json();
}
