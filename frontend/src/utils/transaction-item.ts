export interface TransactionItem {
    id: string;
    name: string;
    amount: number;
}

export interface CreateTransactionItem {
    name: string;
    amount: number;
    splitId: string;
    transactionId: string;
}
