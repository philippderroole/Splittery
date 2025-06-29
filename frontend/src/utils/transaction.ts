import { Money } from "./money";

export interface Transaction {
    id: string;
    name: string;
    date: Date;
    amount: Money;
    splitId: string;
    url: string;
}

export interface SerializedTransaction {
    id: string;
    name: string;
    date: Date;
    amount: number;
    splitId: string;
    url: string;
}

export interface CreateTransaction {
    name: string;
    date: Date;
    amount: number;
    splitId: string;
}

export interface CreateUser {
    name: string;
    splitId: string;
}
