"use client";

import { Button } from "@mui/material";
import { useState } from "react";
import { CreateSplitDialog } from "./create-split-dialog";

export function CreateSplitDialogButton() {
    const [open, setOpen] = useState(false);

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
