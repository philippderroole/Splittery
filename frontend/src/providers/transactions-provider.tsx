"use client";

import { useSplitSocket } from "@/hooks/useSplitSocket";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import React, { useContext, useState } from "react";

const TransactionContext = React.createContext<Transaction[]>(
    [] as Transaction[]
);

export interface TransactionProviderProps {
    serializedTransactions: SerializedTransaction[];
    children: React.ReactNode;
}

export function TransactionsProvider({
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

    useSplitSocket(
        "splitId", // Replace with the actual split ID or context if needed
        ["TransactionChanged", "TransactionDeleted"],
        (payload: unknown) => {
            setTransactionState(payload as Transaction[]);
        }
    );

    return (
        <TransactionContext.Provider value={transactionState}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);

    if (!context) {
        throw new Error(
            "useTransactions must be used within a TransactionsProvider"
        );
    }
    return context;
}
