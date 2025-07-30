"use client";

import { createTransaction } from "@/actions/transaction-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateTransactionDto, Transaction } from "@/utils/transaction";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import TransactionForm from "../../../../../../components/transaction-form";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";

interface EditTransactionDialogProps {
    transaction: Transaction;
    open: boolean;
    onClose: () => void;
}

export function EditTransactionDialog({
    transaction: initalTransaction,
    open,
    onClose,
}: EditTransactionDialogProps) {
    const split = useSplit();

    const [transaction, setTransaction] = useState<CreateTransactionDto>({
        ...initalTransaction,
        amount: initalTransaction.amount.getAmount(),
        tagIds: initalTransaction.tags.map((tag) => tag.id),
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (transaction: CreateTransactionDto) => {
        setPending(true);

        try {
            await createTransaction(split.id, transaction);
            reset();
            onClose();
        } catch {
            setError("Failed to create transaction. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setTransaction({
            ...initalTransaction,
            amount: initalTransaction.amount.getAmount(),
            memberId: "",
            tagIds: initalTransaction.tags.map((tag) => tag.id),
        });
        setError(null);
        setPending(false);
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <Box sx={{ minWidth: "360px" }}>
                <TransactionForm.Root
                    transaction={transaction}
                    setTransaction={setTransaction}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                    isPending={isPending}
                >
                    <DialogTitle>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <TransactionForm.Title
                                content={"Edit transaction"}
                            />
                            <DeleteButton transaction={initalTransaction} />
                        </Box>
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <TransactionForm.Description content={"Edit"} />
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
                        <TransactionForm.SubmitButton content={"Edit"} />
                    </DialogActions>
                </TransactionForm.Root>
            </Box>
        </MobileDialog>
    );
}

interface DeleteButtonProps {
    transaction: Transaction;
}

function DeleteButton({ transaction }: DeleteButtonProps) {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={openDialog}>
                <DeleteIcon />
            </IconButton>
            <DeleteTransactionDialog
                transaction={transaction}
                open={open}
                onClose={handleCancel}
            />
        </>
    );
}
