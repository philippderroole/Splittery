import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Fab } from "@mui/material";
import React from "react";
import { CreateEntryDialog } from "./create-entry-dialog";

export default function CreateEntryDialogButton() {
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
                <AddShoppingCartIcon />
            </Fab>
            <CreateEntryDialog open={open} onClose={closeDialog} />
        </>
    );
}
