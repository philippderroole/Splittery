"use client";

import { Entry } from "@/utils/entry";
import { Transaction } from "@/utils/transaction";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { DeleteEntryDialog } from "./delete-entry-dialog";

interface DeleteButtonProps {
    entry: Entry;
    transaction: Transaction;
}

export default function DeleteEntryDialogButton({ entry }: DeleteButtonProps) {
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
            <DeleteEntryDialog
                entry={entry}
                open={open}
                onClose={handleCancel}
            />
        </>
    );
}
