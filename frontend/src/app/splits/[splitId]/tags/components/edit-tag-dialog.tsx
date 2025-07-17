"use client";

import { createTag } from "@/actions/create-tag-service";
import { useSplit } from "@/providers/split-provider";
import { CreateTagDto, Tag } from "@/utils/tag";
import { Edit as EditIcon } from "@mui/icons-material";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import React from "react";
import EditTag from "./edit-tag";

interface EditTagDialogProps {
    tag?: Tag;
    open: boolean;
    onClose: () => void;
}

export function EditTagDialog(props: EditTagDialogProps) {
    const { tag, open, onClose } = props;

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
                <EditTag.Root
                    initalTag={tag}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                >
                    <DialogTitle>
                        <EditTag.Title />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <EditTag.Description />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <EditTag.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <EditTag.CancelButton />
                        <EditTag.SubmitButton />
                    </DialogActions>
                </EditTag.Root>
            </Box>
        </Dialog>
    );
}

interface EditTagDialogButtonProps {
    tag: Tag;
}

export function EditTagDialogButton(props: EditTagDialogButtonProps) {
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
                <EditIcon />
            </IconButton>
            <EditTagDialog tag={tag} open={open} onClose={closeDialog} />
        </>
    );
}
