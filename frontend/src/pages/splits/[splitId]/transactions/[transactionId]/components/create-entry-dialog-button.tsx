import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Fab } from "@mui/material";
import React from "react";
import { CreateEntryDialog } from "./create-entry-dialog";

export default function CreateEntryDialogFAB() {
    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <div
            style={{
                position: "fixed",
                bottom: "6rem",
                right: "3rem",
                zIndex: 1200,
            }}
        >
            <Fab color="primary" onClick={openDialog}>
                <AddShoppingCartIcon />
            </Fab>
            <CreateEntryDialog open={open} onClose={closeDialog} />
        </div>
    );
}
