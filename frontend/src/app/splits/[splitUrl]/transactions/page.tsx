"use client";

import CreateTransactionGroupButton from "@/components/create-transaction-button";
import TransactionGroupList from "@/components/transaction-group-list";
import { useSplit } from "@/providers/split-provider";
import { Typography } from "@mui/material";

export default function TransactionGroupListPage() {
    const split = useSplit();

    return (
        <>
            <Typography variant="h4">Transactions</Typography>
            <TransactionGroupList />
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateTransactionGroupButton split={split} />
            </div>
        </>
    );
}
