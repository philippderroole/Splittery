import { TextField } from "@mui/material";

interface NameFieldProps {
    name: string;
    setName: (amount: string) => void;
    pending?: boolean;
    error?: string | null;
}

export default function NameField({
    name,
    setName,
    pending = false,
    error = undefined,
}: NameFieldProps) {
    const isError = error !== undefined && error !== null;

    return (
        <TextField
            autoFocus
            required
            margin="dense"
            id="entry-name"
            name="entry-name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Entry name"
            fullWidth
            disabled={pending}
            error={isError}
            helperText={isError && error}
        />
    );
}
