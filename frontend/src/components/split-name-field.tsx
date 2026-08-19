import { TextField } from "@mui/material";

interface SplitNameFieldProps {
    value: string;
    onChange: (name: string) => void;
    error?: string | null;
    disabled?: boolean;
}

export default function SplitNameField({
    value,
    onChange,
    error,
    disabled,
}: SplitNameFieldProps) {
    return (
        <TextField
            autoFocus
            required
            id="split-name"
            name="split-name"
            label="Split name"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Split name"
            margin="dense"
            fullWidth
            disabled={disabled}
            error={!!error}
            helperText={error}
        />
    );
}
