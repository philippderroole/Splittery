import { Currencies } from "./currencies";
import {
    CreateEntryDto,
    SerializedEntry,
    TransactionEntry,
    UpdateEntityDto,
} from "./entry";
import { Money } from "./money";
import { Tag } from "./tag";

export interface Transaction {
    id: string;
    name: string;
    date: Date;
    amount: Money;
    splitId: string;
    url: string;
    tags: Tag[];
    entries: TransactionEntry[];
}

export interface SerializedTransaction {
    id: string;
    name: string;
    date: Date;
    amount: number;
    splitId: string;
    url: string;
    entries?: SerializedEntry[];
}

export interface CreateTransactionDto {
    name: string;
    amount: number | null;
    memberId: string | null;
    tags: Tag[];
}

export interface UpdateTransaction {
    id: string;
    name: string;
    date: Date;
    amount: number;
    splitId: string;
    url: string;
    items: (CreateEntryDto | UpdateEntityDto)[];
}

export function deserializeTransaction(
    serialized: SerializedTransaction
): Transaction {
    console.debug("Deserializing transaction:", serialized);

    return {
        ...serialized,
        date: new Date(serialized.date),
        amount: new Money(serialized.amount, Currencies.EUR),
        tags: [],
        entries:
            serialized.entries?.map((entry) => ({
                ...entry,
                amount: new Money(entry.amount, Currencies.EUR),
            })) || [],
    };
}

export function deserializeTransactions(
    serialized: SerializedTransaction[]
): Transaction[] {
    return serialized.map((t) => {
        return deserializeTransaction(t);
    });
}
