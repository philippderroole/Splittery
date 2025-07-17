import { Money } from "./money";

export interface TransactionItem {
    id: string;
    name: string;
    amount: Money;
}

export interface SerializedTransactionItem {
    id: string;
    name: string;
    amount: number;
}

export interface CreateTransactionItem {
    name: string;
    amount: number;
}

export interface UpdateTransactionItem {
    name: string;
    amount: number;
    url: string;
}
