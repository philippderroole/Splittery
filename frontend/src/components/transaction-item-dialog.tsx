import { useSplit } from "@/providers/split-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import UserSelectionList from "./user-selection-list";

interface TransactionItemDialogProps {
    title: string;
    initialName: string;
    initialAmount?: Money;
    remainingAmount: Money;
    open?: boolean;
    onClose?: () => void;
    onError?: (error?: string) => void;
    submitTransactionItem: (
        name: string,
        amount: number,
        transactionId: string,
        splitId: string,
        url?: string,
        onClose?: () => void,
        onError?: (error?: string) => void
    ) => void;
}

export function TransactionItemDialog(props: TransactionItemDialogProps) {
    const {
        title,
        initialName,
        initialAmount = new Money(0, Currencies.EUR),
        remainingAmount,
        open = false,
        onClose,
        onError,
        submitTransactionItem,
    } = props;

    const split = useSplit();
    const transaction = useTransaction();

    const [name, setName] = useState(initialName);
    const [amount, setAmount] = useState(initialAmount.getAmount());
    const [errors, setErrors] = useState<{ name?: string; amount?: string }>(
        {}
    );

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors: { name?: string; amount?: string } = {};

        errors.name = validateTransactionItemName(name);
        errors.amount = validateTransactionItemAmount(amount!, remainingAmount);

        setErrors(errors);

        if (errors.name || errors.amount) {
            return;
        }

        submitTransactionItem(
            name,
            amount!,
            transaction.url,
            split.id,
            "",
            onClose,
            onError
        );
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
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
                        defaultValue={initialName}
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
                            defaultValue={initialAmount.getAmount() || ""}
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

function validateTransactionItemAmount(amount: number, remainingAmount: Money) {
    if (amount === 0) return "Amount must be greater than 0";
    if (amount > remainingAmount.getAmount())
        return `Amount must be less than or equal to ${remainingAmount.toString()}`;
    if (amount < -1000000 || amount > 1000000)
        return "Amount must be between -1,000,000 and 1,000,000";
}

function validateTransactionItemName(name: string) {
    const newName = name.trim();

    if (newName === "") return "Transaction name is required";
    if (newName.length > 50)
        return "Transaction name must be less than 50 characters";
    if (newName.length < 3)
        return "Transaction name must be at least 3 characters";
}
