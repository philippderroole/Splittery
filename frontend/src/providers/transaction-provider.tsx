"use client";

import { Transaction } from "@/utils/transaction";
import React, { useContext, useMemo } from "react";
import { useTransactions } from "./transactions-provider";

const TransactionContext = React.createContext<Transaction>({} as Transaction);

export interface TransactionProviderProps {
    transactionId: string;
    children: React.ReactNode;
}

export function TransactionProvider({
    transactionId,
    children,
}: TransactionProviderProps) {
    const transactions = useTransactions();

    const transaction = useMemo(
        () => transactions.find((t) => t.id === transactionId)!,
        [transactions, transactionId]
    );

    return (
        <TransactionContext.Provider value={transaction}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    return useContext(TransactionContext);
}
