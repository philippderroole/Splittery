import {
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";

interface AmountFieldProps {
    amount: string;
    setAmount: (amount: string) => void;
    pending?: boolean;
    error?: string | null;
}

export default function AmountField({
    amount,
    setAmount,
    pending = false,
    error = undefined,
}: AmountFieldProps) {
    const isError = error !== undefined && error !== null;

    return (
        <FormControl
            required
            fullWidth
            margin="dense"
            id="amount"
            error={isError}
            disabled={pending}
        >
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <OutlinedInput
                id="entry-amount"
                name="entry-amount"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                startAdornment={
                    <InputAdornment position="start">-</InputAdornment>
                }
                endAdornment={<InputAdornment position="end">€</InputAdornment>}
            />
            <FormHelperText>{isError && error}</FormHelperText>
        </FormControl>
    );
}
