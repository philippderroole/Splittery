"use client";

import { deleteEntry } from "@/actions/entry-service";
import BaseForm from "@/components/base-form";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { Entry } from "@/utils/entry";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";

interface DeleteEntryDialogProps {
    entry: Entry;
    open: boolean;
    onClose: () => void;
}

export function DeleteEntryDialog({
    entry,
    open,
    onClose,
}: DeleteEntryDialogProps) {
    const split = useSplit();
    const transaction = useTransaction();

    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (entry: Entry) => {
        setPending(true);

        try {
            await deleteEntry(split.id, transaction.id, entry.id);
            onClose();
        } catch {
            setError("Failed to delete entry. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <BaseForm.Root<Entry>
                item={entry}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                pending={isPending}
            >
                <DialogTitle>
                    <Box>
                        <BaseForm.Title>Delete {entry.name}</BaseForm.Title>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <BaseForm.Description>
                            Are you sure you want to delete this entry? This
                            action cannot be undone.
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
