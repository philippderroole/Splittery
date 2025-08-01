import { Currencies } from "./currencies";
import { CreateEntryDto, EditEntityDto, Entry, SerializedEntry } from "./entry";
import { Money } from "./money";

export interface Transaction {
    id: string;
    name: string;
    executedAt: Date;
    amount: Money;
    splitId: string;
    memberId: string;
    url: string;
    tagIds: string[];
    entries: Entry[];
}

export interface SerializedTransaction {
    id: string;
    name: string;
    executedAt: Date;
    amount: number;
    splitId: string;
    memberId: string;
    url: string;
    entries?: SerializedEntry[];
    tagIds: string[];
}

export interface CreateTransactionDto {
    name: string;
    amount: number | null;
    memberId: string | null;
    tagIds: string[];
}

export interface UpdateTransaction {
    id: string;
    name: string;
    date: Date;
    amount: number;
    splitId: string;
    url: string;
    items: (CreateEntryDto | EditEntityDto)[];
}

export function deserializeTransaction(
    serialized: SerializedTransaction
): Transaction {
    return {
        ...serialized,
        executedAt: new Date(serialized.executedAt),
        amount: new Money(serialized.amount, Currencies.EUR),
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
