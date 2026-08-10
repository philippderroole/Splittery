import { Entry } from "../utils/entry";
import { GET } from "../utils/request";
import { SerializedTransaction } from "../utils/transaction";

export async function getTransactions(
    splitId: string,
): Promise<SerializedTransaction[]> {
    const apiUrl = import.meta.env.VITE_API_URL;

    return await GET(`${apiUrl}/splits/${splitId}/transactions`);
}

export async function getEntriesForTransaction(
    splitId: string,
    transactionId: string,
): Promise<Entry[]> {
    const apiUrl = import.meta.env.VITE_API_URL;

    return await GET(
        `${apiUrl}/splits/${splitId}/transactions/${transactionId}/entries`,
    );
}
