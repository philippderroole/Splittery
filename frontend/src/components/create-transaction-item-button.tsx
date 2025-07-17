"use client";

import { createTransactionItem } from "@/actions/create-transaction-item-service";
import { Money } from "@/utils/money";
import { CreateTransactionItem } from "@/utils/transaction-item";
import CloseIcon from "@mui/icons-material/Close";
import {
    Alert,
    IconButton,
    ListItemButton,
    ListItemText,
    Portal,
    Snackbar,
} from "@mui/material";
import { useState } from "react";
import { TransactionItemDialog } from "./transaction-item-dialog";

interface CreateTransactionItemProps {
    remainingAmount: Money;
}

export default function CreateTransactionItemButton(
    props: CreateTransactionItemProps
) {
    const { remainingAmount } = props;

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    return (
        <>
            <ListItemButton
                onClick={() => {
                    setOpenDialog(true);
                }}
            >
                <ListItemText
                    sx={{
                        textAlign: "center",
                    }}
                >
                    Add
                </ListItemText>
            </ListItemButton>
            <TransactionItemDialog
                title="Create an item"
                initialName=""
                remainingAmount={remainingAmount}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onError={(error) => {
                    setOpenSnackbar(true);
                    setSnackbarMessage(
                        error ||
                            "An error occurred while creating the transaction."
                    );
                }}
                submitTransactionItem={submitTransactionItem}
            />
            <Portal>
                <Snackbar
                    open={openSnackbar}
                    message={snackbarMessage}
                    autoHideDuration={5000}
                    onClose={(_, reason) => {
                        if (reason === "clickaway") return;
                        setOpenSnackbar(false);
                    }}
                    action={
                        <IconButton>
                            <CloseIcon onClick={() => setOpenSnackbar(false)} />
                        </IconButton>
                    }
                    sx={{ bottom: 80 }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="error"
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Portal>
        </>
    );
}

function submitTransactionItem(
    name: string,
    amount: number,
    transactionId: string,
    splitId: string,
    url?: string,
    onClose?: (() => void) | undefined,
    onError?: ((error?: string) => void) | undefined
) {
    const createTransactionItemDto: CreateTransactionItem = {
        name: name,
        amount: amount,
    };

    createTransactionItem(createTransactionItemDto, splitId, transactionId)
        .then(() => {
            onClose?.();
        })
        .catch((error) => {
            onError?.(error.message);
        });
}
