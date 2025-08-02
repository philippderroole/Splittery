import { Currencies } from "./currencies";
import { deserializeEntries, Entry, SerializedEntry } from "./entry";
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

export interface UpdateTransactionDto {
    id: string;
    name: string;
    amount: number | null;
    splitId: string;
    memberId: string;
    tagIds: string[];
}

export function deserializeTransaction(
    serialized: SerializedTransaction
): Transaction {
    return {
        ...serialized,
        executedAt: new Date(serialized.executedAt),
        amount: new Money(serialized.amount, Currencies.EUR),
        entries: deserializeEntries(serialized.entries || []),
    };
}

export function deserializeTransactions(
    serialized: SerializedTransaction[]
): Transaction[] {
    return serialized.map((t) => {
        return deserializeTransaction(t);
    });
}
