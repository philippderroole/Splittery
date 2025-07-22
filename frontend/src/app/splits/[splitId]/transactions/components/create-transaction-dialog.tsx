"use client";

import { createTransaction } from "@/actions/create-transaction-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateTransactionDto } from "@/utils/transaction";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
} from "@mui/material";
import React from "react";
import TransactionForm from "./transaction-form";

interface CreateTransactionDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateTransactionDialog(props: CreateTransactionDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

    const handleSubmit = async (transaction: CreateTransactionDto) => {
        try {
            await createTransaction(split.id, transaction);
        } catch (e) {
            console.error("Error creating transaction:", e);
            return new Error("Failed to create transaction. Please try again.");
        }
    };

    return (
        <MobileDialog open={open} onClose={onClose}>
            <TransactionForm.Root onSubmit={handleSubmit} onCancel={onClose}>
                <DialogTitle>
                    <TransactionForm.Title
                        content={"Create a new transaction"}
                    />
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <TransactionForm.Description
                            content={
                                "Create a new transaction for this split. You can add tags to categorize the transaction."
                            }
                        />
                    </DialogContentText>
                    <div style={{ marginTop: "16px" }} />
                    <TransactionForm.FormInputs />
                </DialogContent>
                <DialogActions>
                    <TransactionForm.CancelButton />
                    <TransactionForm.SubmitButton content={"Create"} />
                </DialogActions>
            </TransactionForm.Root>
        </MobileDialog>
    );
}

export function CreateTransactionDialogButton() {
    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab color="primary" onClick={openDialog}>
                <ShoppingCartIcon />
            </Fab>
            <CreateTransactionDialog open={open} onClose={closeDialog} />
        </>
    );
}
