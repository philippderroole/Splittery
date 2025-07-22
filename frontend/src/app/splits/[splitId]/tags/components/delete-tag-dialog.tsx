"use client";

import { deleteTag } from "@/actions/tags/delete-tag-service";
import { useSplit } from "@/providers/split-provider";
import { Tag } from "@/utils/tag";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import React, { useState } from "react";
import DeleteTag from "./delete-tag";

interface DeleteTagDialogProps {
    tag: Tag;
    open: boolean;
    onClose: () => void;
}

export function DeleteTagDialog(props: DeleteTagDialogProps) {
    const { tag, open, onClose } = props;

    const split = useSplit();

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (tag: Tag) => {
        try {
            await deleteTag(split.id, tag.id);
            onClose();
        } catch {
            setError("Failed to delete tag. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DeleteTag.Root
                tag={tag}
                onSubmit={handleSubmit}
                onCancel={onClose}
            >
                <DialogTitle>
                    <DeleteTag.Title />
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <DeleteTag.Description />
                    </DialogContentText>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <DeleteTag.CancelButton />
                    <DeleteTag.SubmitButton />
                </DialogActions>
            </DeleteTag.Root>
        </Dialog>
    );
}

interface DeleteTagDialogButtonProps {
    tag: Tag;
}

export function DeleteTagDialogButton(props: DeleteTagDialogButtonProps) {
    const { tag } = props;

    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={openDialog}>
                <DeleteIcon />
            </IconButton>
            <DeleteTagDialog tag={tag} open={open} onClose={closeDialog} />
        </>
    );
}
