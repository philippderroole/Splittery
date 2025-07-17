"use client";

import { createTag } from "@/actions/create-tag-service";
import { useSplit } from "@/providers/split-provider";
import { CreateTagDto } from "@/utils/tag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
} from "@mui/material";
import React from "react";
import CreateTag from "./create-tag";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateSplitUserDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

    const handleSubmit = async (tag: CreateTagDto) => {
        try {
            await createTag(split.id, tag);
        } catch {
            return new Error("Failed to create user. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box sx={{ minWidth: "360px" }}>
                <CreateTag.Root onSubmit={handleSubmit} onCancel={onClose}>
                    <DialogTitle>
                        <CreateTag.Title />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <CreateTag.Description />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <CreateTag.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <CreateTag.CancelButton />
                        <CreateTag.SubmitButton />
                    </DialogActions>
                </CreateTag.Root>
            </Box>
        </Dialog>
    );
}

export function CreateTagDialogButton() {
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
                <LocalOfferIcon />
            </Fab>
            <CreateSplitUserDialog open={open} onClose={closeDialog} />
        </>
    );
}
