"use client";

import TransactionList from "@/app/splits/[splitId]/transactions/components/transaction-list";
import { useSplit } from "@/providers/split-provider";
import { Typography } from "@mui/material";
import { CreateTransactionDialogButton } from "./components/create-transaction-dialog";

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
                <CreateTransactionDialogButton />
            </div>
        </>
    );
}
