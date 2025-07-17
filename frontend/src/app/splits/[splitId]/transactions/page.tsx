"use client";

import CreateTransactionButton from "@/app/splits/[splitId]/transactions/[transactionUrl]/components/create-transaction-button";
import TransactionList from "@/components/transaction-list";
import { useSplit } from "@/providers/split-provider";
import { Typography } from "@mui/material";

export default function TransactionGroupListPage() {
    const split = useSplit();

    return (
        <>
            <Typography variant="h4">Transactions</Typography>
            <TransactionList />
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateTransactionButton split={split} />
            </div>
        </>
    );
}
