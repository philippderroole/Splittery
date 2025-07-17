"use client";

import { createSplit } from "@/actions/create-split-service";
import CreateSplit from "@/app/components/create-split";
import { CreateSplitDto } from "@/utils/split";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import React from "react";

interface CreateSplitDialogProps {
    open: boolean;
    onClose: () => void;
    loading?: boolean;
}

export function CreateSplitDialog(props: CreateSplitDialogProps) {
    const { open, onClose } = props;

    const handleSubmit = async (split: CreateSplitDto) => {
        if (!split.name.trim()) return;

        split.name = split.name.trim();

        try {
            const newSplit = await createSplit(split);
            window.location.href = `/splits/${newSplit.id}/transactions`;
        } catch {
            return new Error("Failed to create split. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box sx={{ minWidth: "360px" }}>
                <CreateSplit.Root onSubmit={handleSubmit} onCancel={onClose}>
                    <DialogTitle>
                        <CreateSplit.Title />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <CreateSplit.Description />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <CreateSplit.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <CreateSplit.CancelButton />
                        <CreateSplit.SubmitButton />
                    </DialogActions>
                </CreateSplit.Root>
            </Box>
        </Dialog>
    );
}

export function CreateSplitDialogButton() {
    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Button onClick={openDialog}>Create a new Split</Button>
            <CreateSplitDialog open={open} onClose={closeDialog} />
        </>
    );
}
