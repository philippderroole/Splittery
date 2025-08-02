"use client";

import { Entry } from "@/utils/entry";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { DeleteEntryDialog } from "./delete-entry-dialog";

interface DeleteButtonProps {
    entry: Entry;
    onSubmit: () => void;
}

export default function DeleteEntryDialogButton({
    entry,
    onSubmit,
}: DeleteButtonProps) {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        onSubmit();
        closeDialog();
    };

    const handleCancel = () => {
        closeDialog();
    };

    return (
        <>
            <IconButton onClick={openDialog}>
                <DeleteIcon />
            </IconButton>
            <DeleteEntryDialog
                entry={entry}
                open={open}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            />
        </>
    );
}
