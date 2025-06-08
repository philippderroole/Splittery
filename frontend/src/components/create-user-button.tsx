"use client";

import { createTransactionGroup } from "@/app/actions/create-transaction-service";
import { Split } from "@/utils/split";
import { CreateTransaction } from "@/utils/transaction";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import {
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
import { useState } from "react";

interface CreateUserButtonProps {
    split: Split;
}

export default function CreateUserButton(props: CreateUserButtonProps) {
    const { split } = props;

    const [openDialog, setOpenDialog] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    return (
        <>
            <Fab color="primary" onClick={() => setOpenDialog(true)}>
                <PersonAddAltIcon />
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
        if (newAmount < -1000000 || newAmount > 1000000)
            newErrors.amount =
                "Amount must be between -1,000,000 and 1,000,000";

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            return;
        }

        const transactionGroup: CreateTransaction = {
            splitId: split.id,
            name: newName,
            amount: newAmount,
        };

        createTransactionGroup(transactionGroup, split.id)
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
