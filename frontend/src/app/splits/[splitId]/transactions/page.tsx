"use client";

import TransactionList from "@/app/splits/[splitId]/transactions/components/transaction-list";
import { CreateTransactionDialogButton } from "./components/create-transaction-dialog";

export default function TransactionGroupListPage() {
    return (
        <>
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
