"use client";

import { useSplitSocket } from "@/hooks/useSplitSocket";
import { deserializeEntry, SerializedEntry } from "@/utils/entry";
import {
    deserializeTransaction,
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

    const [transactions, setTransactions] =
        useState<Transaction[]>(initialTransactions);

    const split = useSplit();

    useSplitSocket(split.id, ["TransactionCreated"], (payload: unknown) => {
        const transactionPayload = payload as {
            transaction: SerializedTransaction;
        };

        const newTransaction = deserializeTransaction(
            transactionPayload.transaction
        );

        setTransactions([...transactions, newTransaction]);
    });

    useSplitSocket(split.id, ["TransactionUpdated"], (payload: unknown) => {
        const transactionPayload = payload as {
            transaction: SerializedTransaction;
        };

        const updatedTransaction = deserializeTransaction(
            transactionPayload.transaction
        );

        const oldTransactions = transactions.filter(
            (t) => t.id !== updatedTransaction.id
        );

        setTransactions([...oldTransactions, updatedTransaction]);
    });

    useSplitSocket(split.id, ["TransactionDeleted"], (payload: unknown) => {
        const transactionPayload = payload as { transactionId: string };

        const remainingTransactions = transactions.filter(
            (t) => t.id !== transactionPayload.transactionId
        );

        setTransactions(remainingTransactions);
    });

    useSplitSocket(split.id, ["EntryCreated"], (payload: unknown) => {
        const entryPayload = payload as { entry: SerializedEntry };
        const newEntry = deserializeEntry(entryPayload.entry);

        const updatedTransaction = transactions.find(
            (t) => t.id === newEntry.transactionId
        )!;
        updatedTransaction.entries.push(newEntry);

        const oldTransactions = transactions.filter(
            (t) => t.id !== updatedTransaction.id
        );

        setTransactions([...oldTransactions, updatedTransaction]);
    });

    useSplitSocket(split.id, ["EntryUpdated"], (payload: unknown) => {
        const entryPayload = payload as { entry: SerializedEntry };
        const updatedEntry = deserializeEntry(entryPayload.entry);

        const updatedTransaction = transactions.find(
            (t) => t.id === updatedEntry.transactionId
        )!;

        const oldEntries = updatedTransaction.entries.filter(
            (e) => e.id !== updatedEntry.id
        );

        updatedTransaction.entries = [...oldEntries, updatedEntry];

        const oldTransactions = transactions.filter(
            (t) => t.id !== updatedTransaction.id
        );

        setTransactions([...oldTransactions, updatedTransaction]);
    });

    useSplitSocket(split.id, ["EntryDeleted"], (payload: unknown) => {
        const entryPayload = payload as { entryId: string };

        const updatedTransactions = transactions.map((transaction) => {
            const remainingEntries = transaction.entries.filter(
                (e) => e.id !== entryPayload.entryId
            );
            return {
                ...transaction,
                entries: remainingEntries,
            };
        });

        setTransactions(updatedTransactions);
    });

    return (
        <TransactionContext.Provider value={transactions}>
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
