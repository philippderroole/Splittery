"use client";

import { createTransaction } from "@/actions/create-transaction-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateTransactionDto, Transaction } from "@/utils/transaction";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import TransactionForm from "../../../../../../components/transaction-form";

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
        memberId: "",
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
                        <TransactionForm.Title content={"Edit transaction"} />
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
