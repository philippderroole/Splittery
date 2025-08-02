import { Currencies } from "./currencies";
import { Money } from "./money";

export interface Entry {
    id: string;
    name: string;
    amount: Money;
    transactionId: string;
    tagIds: string[];
}

export interface SerializedEntry {
    id: string;
    name: string;
    amount: number;
    transactionId: string;
    tagIds: string[];
}

export interface CreateEntryDto {
    name: string;
    amount: number | null;
    tagIds: string[];
}

export interface EditEntityDto {
    id: string;
    name: string;
    amount: number | null;
    tagIds: string[];
}

export function deserializeEntry(serialized: SerializedEntry): Entry {
    return {
        ...serialized,
        amount: new Money(serialized.amount, Currencies.EUR),
    };
}

export function deserializeEntries(
    serializedEntries: SerializedEntry[]
): Entry[] {
    return serializedEntries.map(deserializeEntry);
}
