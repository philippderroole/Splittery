"use client";

import { createTransaction } from "@/actions/create-transaction-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateTransactionDto } from "@/utils/transaction";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
} from "@mui/material";
import React, { useState } from "react";
import TransactionForm from "../../../../../components/transaction-form";

interface CreateTransactionDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateTransactionDialog(props: CreateTransactionDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

    const [transaction, setTransaction] = useState<CreateTransactionDto>({
        name: "",
        amount: null,
        memberId: "",
        tagIds: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (transaction: CreateTransactionDto) => {
        setPending(true);

        console.log("Creating transaction:", transaction);

        try {
            await createTransaction(split.id, transaction);
            reset();
            onClose();
        } catch (e) {
            setError("Failed to create transaction. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setTransaction({ name: "", amount: null, memberId: "", tagIds: [] });
        setError(null);
        setPending(false);
    };

    return (
        <MobileDialog open={open} onClose={onClose}>
            <TransactionForm.Root
                transaction={transaction}
                setTransaction={setTransaction}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isPending={isPending}
            >
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
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
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
