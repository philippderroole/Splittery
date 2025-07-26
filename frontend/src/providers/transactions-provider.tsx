"use client";

import { useSplitSocket } from "@/hooks/useSplitSocket";
import {
    deserializeTransactions,
    SerializedTransaction,
    Transaction,
} from "@/utils/transaction";
import React, { useContext, useState } from "react";
import { useSplit } from "./split-provider";

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
    const initialTransactions: Transaction[] = deserializeTransactions(
        initialSerializedTransactions
    );

    const [transactionState, setTransactionState] =
        useState<Transaction[]>(initialTransactions);

    const split = useSplit();

    useSplitSocket(
        split.id, // Replace with the actual split ID or context if needed
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
