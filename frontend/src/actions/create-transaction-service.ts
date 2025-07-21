"use server";

import { POST } from "@/utils/request";
import { Tag } from "@/utils/tag";
import {
    CreateTransactionDto,
    SerializedTransaction,
} from "@/utils/transaction";

export async function createTransaction(
    splitId: string,
    transaction: CreateTransactionDto,
    tags: Tag[]
): Promise<SerializedTransaction> {
    return await POST(
        `${process.env.INTERNAL_API_URL}/splits/${splitId}/transactions`,
        {
            body: JSON.stringify(transaction),
        }
    );
}
