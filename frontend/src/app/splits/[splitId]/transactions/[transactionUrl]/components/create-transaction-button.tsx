"use client";

import { createTransaction } from "@/actions/create-transaction-service";
import { Split } from "@/utils/split";
import { CreateTransaction } from "@/utils/transaction";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
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
    Fab,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Portal,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserSelectionList from "../../../../../../components/user-selection-list";

interface TransactionGroupProps {
    split: Split;
}

export default function CreateTransactionButton(props: TransactionGroupProps) {
    const { split } = props;

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    return (
        <>
            <Fab color="primary" onClick={() => setOpenDialog(true)}>
                <ShoppingCartIcon />
            </Fab>
            <CreateTransactionGroupDialog
                split={split}
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

interface CreateTransactionGroupDialogProps {
    split: Split;
    open?: boolean;
    onClose?: () => void;
    onError?: (error?: string) => void;
}

function CreateTransactionGroupDialog(
    props: CreateTransactionGroupDialogProps
) {
    const { split, open = false, onClose, onError } = props;

    const [name, setName] = useState("");
    const [amount, setAmount] = useState<number | undefined>(undefined);
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

        if (amount === undefined || amount === null) {
            newErrors.amount = "Amount is required";
        }
        let newAmount = Number(amount);
        if (newAmount < 0) newAmount *= -1;
        if (newAmount < -1000000 || newAmount > 1000000)
            newErrors.amount =
                "Amount must be between -1,000,000 and 1,000,000";

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            return;
        }

        const transaction: CreateTransaction = {
            splitId: split.id,
            name: newName,
            amount: newAmount,
        };

        createTransaction(transaction, split.id)
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
                <DialogTitle>Create a transaction</DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText></DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="transaction-name"
                        name="transaction-name"
                        label="Transaction name"
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
                            type="number"
                            onChange={(e) => setAmount(Number(e.target.value))}
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
                        <UserSelectionList totalAmount={amount} />
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
