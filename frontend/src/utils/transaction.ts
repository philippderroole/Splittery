import { Money } from "./money";
import {
    CreateTransactionItem,
    SerializedTransactionItem,
    TransactionItem,
    UpdateTransactionItem,
} from "./transaction-item";

export interface Transaction {
    id: string;
    name: string;
    date: Date;
    amount: Money;
    splitId: string;
    url: string;
    items: TransactionItem[];
}

export interface SerializedTransaction {
    id: string;
    name: string;
    date: Date;
    amount: number;
    splitId: string;
    url: string;
    items: SerializedTransactionItem[];
}

export interface CreateTransaction {
    name: string;
    amount: number;
    splitId: string;
}

export interface UpdateTransaction {
    id: string;
    name: string;
    date: Date;
    amount: number;
    splitId: string;
    url: string;
    items: (CreateTransactionItem | UpdateTransactionItem)[];
}
