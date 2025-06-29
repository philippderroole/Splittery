"use client";

import { useTransactionSocket } from "@/hooks/useTransactionSocket";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import React, { useContext, useState } from "react";

const TransactionContext = React.createContext<Transaction>({} as Transaction);

export interface TransactionProviderProps {
    splitUrl: string;
    serializedTransaction: SerializedTransaction;
    children: React.ReactNode;
}

export function TransactionProvider({
    splitUrl,
    serializedTransaction: initialSerializedTransaction,
    children,
}: TransactionProviderProps) {
    const initialTransaction: Transaction = {
        ...initialSerializedTransaction,
        date: new Date(initialSerializedTransaction.date),
        amount: new Money(initialSerializedTransaction.amount, Currencies.EUR),
        items: initialSerializedTransaction.items.map((item) => ({
            ...item,
            amount: new Money(item.amount, Currencies.EUR),
        })),
    };

    const [transactionState, setTransactionState] =
        useState<Transaction>(initialTransaction);

    useTransactionSocket(
        splitUrl,
        initialTransaction.url,
        (updatedTransaction: Transaction) => {
            setTransactionState(updatedTransaction);
        }
    );

    return (
        <TransactionContext.Provider value={transactionState}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    return useContext(TransactionContext);
}
