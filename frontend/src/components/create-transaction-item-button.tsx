"use client";

import { createTransactionItem } from "@/app/actions/create-transaction-item-service";
import { Money } from "@/utils/money";
import { Split } from "@/utils/split";
import { CreateTransactionItem } from "@/utils/transaction-item";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemButton,
    ListItemText,
    OutlinedInput,
    Portal,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserSelectionList from "./user-selection-list";

interface CreateTransactionItemProps {
    split: Split;
    remainingAmount: Money;
}

export default function CreateTransactionItemButton(
    props: CreateTransactionItemProps
) {
    const { split, remainingAmount } = props;

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    return (
        <>
            <ListItemButton
                onClick={() => {
                    setOpenDialog(true);
                }}
            >
                <ListItemText
                    sx={{
                        textAlign: "center",
                    }}
                >
                    Add
                </ListItemText>
            </ListItemButton>
            <CreateTransactionItemDialog
                split={split}
                remainingAmount={remainingAmount}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onError={(error) => {
                    setOpenSnackbar(true);
                    setSnackbarMessage(
                        error ||
                            "An error occurred while creating the transaction."
                    );
                }}
            />
            <Portal>
                <Snackbar
                    open={openSnackbar}
                    message={snackbarMessage}
                    autoHideDuration={5000}
                    onClose={(_, reason) => {
                        if (reason === "clickaway") return;
                        setOpenSnackbar(false);
                    }}
                    action={
                        <IconButton>
                            <CloseIcon onClick={() => setOpenSnackbar(false)} />
                        </IconButton>
                    }
                    sx={{ bottom: 80 }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity="error"
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Portal>
        </>
    );
}

interface CreateTransactionItemDialogProps {
    split: Split;
    remainingAmount: Money;
    open?: boolean;
    onClose?: () => void;
    onError?: (error?: string) => void;
}

function CreateTransactionItemDialog(props: CreateTransactionItemDialogProps) {
    const { split, remainingAmount, open = false, onClose, onError } = props;

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState<{ name?: string; amount?: string }>(
        {}
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: typeof errors = {};

        const newName = name.trim();

        if (newName === "") newErrors.name = "Transaction name is required";
        if (newName.length > 50)
            newErrors.name = "Transaction name must be less than 50 characters";
        if (newName.length < 3)
            newErrors.name = "Transaction name must be at least 3 characters";

        if (amount.trim() === "") newErrors.amount = "Amount is required";
        if (isNaN(Number(amount.trim())))
            newErrors.amount = "Amount must be a number";

        let newAmount = Number(amount.trim());
        if (newAmount < 0) newAmount *= -1;
        if (newAmount === 0) newErrors.amount = "Amount must be greater than 0";
        if (newAmount > remainingAmount.getAmount())
            newErrors.amount = `Amount must be less than or equal to ${remainingAmount.toString()}`;
        if (newAmount < -1000000 || newAmount > 1000000)
            newErrors.amount =
                "Amount must be between -1,000,000 and 1,000,000";

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            return;
        }

        const transactionItem: CreateTransactionItem = {
            splitId: split.id,
            name: newName,
            amount: newAmount,
            transactionId: "",
        };

        createTransactionItem(transactionItem, split.id)
            .then(() => {
                onClose?.();
            })
            .catch((error) => {
                onError?.(error.message);
            });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>Create an item</DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText></DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="transaction-name"
                        name="transaction-name"
                        label="Item name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <FormControl
                        required
                        margin="dense"
                        fullWidth
                        sx={{ marginTop: 1 }}
                        id="amount"
                        error={!!errors.amount}
                    >
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <OutlinedInput
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    -
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    €
                                </InputAdornment>
                            }
                            label="Amount"
                        />
                        {errors.amount && (
                            <Typography color="error" variant="caption">
                                {errors.amount}
                            </Typography>
                        )}
                    </FormControl>
                    <AdvancedSettings>
                        <UserSelectionList />
                    </AdvancedSettings>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

interface AdvancedSettingsProps {
    children?: React.ReactNode;
}

function AdvancedSettings(pops: AdvancedSettingsProps) {
    const { children } = pops;

    const [expanded, setExpanded] = useState(false);

    return (
        <Accordion
            disableGutters
            elevation={0}
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            sx={{
                "&::before": {
                    display: "none",
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="advanced-settings-header"
                sx={{
                    paddingY: 1,
                }}
            >
                <Typography component="span">Advanced settings</Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    padding: 0,
                }}
            >
                {children}
            </AccordionDetails>
        </Accordion>
    );
}
