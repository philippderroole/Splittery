"use client";

import { createTransaction } from "@/actions/create-transaction-service";
import { useSplit } from "@/providers/split-provider";
import { Tag } from "@/utils/tag";
import { CreateTransactionDto } from "@/utils/transaction";
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
import TransactionForm from "./transaction-form";

interface CreateTransactionDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateTransactionDialog(props: CreateTransactionDialogProps) {
    const { open, onClose } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const split = useSplit();

    const handleSubmit = async (
        transaction: CreateTransactionDto,
        selectedTags: Tag[]
    ) => {
        console.debug("Submitting transaction:", transaction);

        try {
            const newTransaction = await createTransaction(
                split.id,
                transaction,
                selectedTags
            );
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
                        <TransactionForm.Title
                            content={"Create a new transaction"}
                        />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <TransactionForm.Description
                                content={
                                    "Create a new transaction for this split. You can add tags to categorize the transaction."
                                }
                            />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <TransactionForm.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <TransactionForm.CancelButton />
                        <TransactionForm.SubmitButton content={"Create"} />
                    </DialogActions>
                </TransactionForm.Root>
            </Box>
        </Dialog>
    );
}

export function CreateTransactionDialogButton() {
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
            <CreateTransactionDialog open={open} onClose={closeDialog} />
        </>
    );
}
