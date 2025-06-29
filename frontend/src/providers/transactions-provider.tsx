"use client";

import { useTransactionsSocket } from "@/hooks/useTransactionsSocket";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import React, { useContext, useState } from "react";

const TransactionContext = React.createContext<Transaction[]>(
    [] as Transaction[]
);

export interface TransactionProviderProps {
    splitUrl: string;
    serializedTransactions: SerializedTransaction[];
    children: React.ReactNode;
}

export function TransactionsProvider({
    splitUrl,
    serializedTransactions: initialSerializedTransactions,
    children,
}: TransactionProviderProps) {
    const initialTransactions: Transaction[] =
        initialSerializedTransactions.map((initialSerializedTransaction) => {
            return {
                ...initialSerializedTransaction,
                date: new Date(initialSerializedTransaction.date),
                amount: new Money(
                    initialSerializedTransaction.amount,
                    Currencies.EUR
                ),
                items: initialSerializedTransaction.items.map((item) => ({
                    ...item,
                    amount: new Money(item.amount, Currencies.EUR),
                })),
            };
        });

    const [transactionState, setTransactionState] =
        useState<Transaction[]>(initialTransactions);

    useTransactionsSocket(splitUrl, (updatedTransactions: Transaction[]) => {
        setTransactionState(updatedTransactions);
    });

    return (
        <TransactionContext.Provider value={transactionState}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    return useContext(TransactionContext);
}
