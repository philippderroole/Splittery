"use client";

import EntryList from "@/app/splits/[splitId]/transactions/[transactionId]/components/entry-list";
import { useSplit } from "@/providers/split-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { getFormattedDateLong } from "@/utils/date-formatter";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import CreateEntryDialogButton from "./components/create-entry-dialog-button";
import { EditTransactionDialog } from "./components/edit-transaction-dialog";

export default function TransactionPage() {
    const split = useSplit();

    return (
        <>
            <Link href={`/splits/${split.id}/transactions`}>
                <IconButton>
                    <ArrowBackIosIcon />
                </IconButton>
            </Link>
            <TransactionHeader />
            <EntryList />
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateEntryDialogButton />
            </div>
        </>
    );
}

function TransactionHeader() {
    const transaction = useTransaction();

    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                onClick={openDialog}
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 1,
                    textTransform: "none",
                    color: "inherit",
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                    }}
                >
                    <Typography variant="h4">
                        {transaction.amount.toString()}
                    </Typography>
                    <Typography variant="body1">{transaction.name}</Typography>
                    <Typography variant="caption">
                        {getFormattedDateLong(transaction.executedAt)}
                    </Typography>
                </Box>
                <Avatar />
            </Button>
            <EditTransactionDialog
                open={open}
                onClose={closeDialog}
                transaction={transaction}
            />
        </>
    );
}
