"use client";

import { deleteTransaction } from "@/actions/transaction-service";
import BaseForm from "@/components/base-form";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { Transaction } from "@/utils/transaction";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteTransactionDialogProps {
    transaction: Transaction;
    open: boolean;
    onClose: () => void;
}

export function DeleteTransactionDialog({
    transaction,
    open,
    onClose,
}: DeleteTransactionDialogProps) {
    const split = useSplit();
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (transaction: Transaction) => {
        setPending(true);

        try {
            await deleteTransaction(split.id, transaction.id);
            router.push(`/splits/${split.id}/transactions`);
        } catch {
            setError("Failed to delete transaction. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <BaseForm.Root<Transaction>
                item={transaction}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                pending={isPending}
            >
                <DialogTitle>
                    <Box>
                        <BaseForm.Title>
                            Delete {transaction.name}
                        </BaseForm.Title>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <BaseForm.Description>
                            Are you sure you want to delete this transaction?
                            This action cannot be undone.
                        </BaseForm.Description>
                    </DialogContentText>
                    <div style={{ marginTop: "16px" }} />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <BaseForm.CancelButton />
                    <BaseForm.SubmitButton>Delete</BaseForm.SubmitButton>
                </DialogActions>
            </BaseForm.Root>
        </MobileDialog>
    );
}
