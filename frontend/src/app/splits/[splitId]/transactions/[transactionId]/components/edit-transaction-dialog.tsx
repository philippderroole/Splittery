"use client";

import { createTransaction } from "@/actions/create-transaction-service";
import { useSplit } from "@/providers/split-provider";
import { CreateTransactionDto, Transaction } from "@/utils/transaction";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React from "react";
import TransactionForm from "../../components/transaction-form";

interface EditTransactionDialogProps {
    transaction?: Transaction;
    open: boolean;
    onClose: () => void;
}

export function EditTransactionDialog(props: EditTransactionDialogProps) {
    const { open, onClose } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const split = useSplit();

    const handleSubmit = async (transaction: CreateTransactionDto) => {
        console.debug("Submitting transaction:", transaction);

        try {
            await createTransaction(split.id, transaction);
        } catch (e) {
            console.error("Error creating transaction:", e);
            return new Error("Failed to create transaction. Please try again.");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        ...(isMobile && {
                            position: "fixed",
                            top: "10%",
                            margin: "0 16px",
                            width: "calc(100% - 32px)",
                            maxWidth: "none",
                            borderRadius: 2,
                        }),
                    },
                },
            }}
        >
            <Box sx={{ minWidth: "360px" }}>
                <TransactionForm.Root
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                >
                    <DialogTitle>
                        <TransactionForm.Title content={"Edit transaction"} />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <TransactionForm.Description content={"Edit"} />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <TransactionForm.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <TransactionForm.CancelButton />
                        <TransactionForm.SubmitButton content={"Edit"} />
                    </DialogActions>
                </TransactionForm.Root>
            </Box>
        </Dialog>
    );
}

export function EditTransactionDialogButton() {
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
                <ShoppingCartIcon />
            </Fab>
            <EditTransactionDialog open={open} onClose={closeDialog} />
        </>
    );
}
