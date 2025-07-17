import { CreateSplitDto } from "@/utils/split";
import { Alert, Button, FormControl, TextField } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type CreateSplitContextType = {
    split: CreateSplitDto;
    onSaveClick: () => void;
    onCancelClick: () => void;
    setSplitName: (name: string) => void;
    isPending: boolean;
    error: string | null;
    validationError: string | null;
};

const CreateSplitContext = createContext<CreateSplitContextType | null>(null);

const useCreateSplitContext = () => {
    const currentUserContext = useContext(CreateSplitContext);

    if (!currentUserContext) {
        throw new Error(
            "useCreateSplitContext must be used within a CreateSplitContext.Provider"
        );
    }

    return currentUserContext;
};

interface CreateSplitCompoundProps {
    children?: ReactNode;
    onSubmit: (split: CreateSplitDto) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: CreateSplitCompoundProps) {
    const { children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);
    const [split, setSplit] = useState<CreateSplitDto>({ name: "" });
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const onSaveClick = async () => {
        if (isPending) return;

        const newSplit = { ...split, name: split.name.trim() };

        const validationError = validateSplitName(newSplit.name);
        setValidationError(validationError);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationError) {
            return;
        }

        console.log("Submitting split:", newSplit);

        setPending(true);
        setError(null);
        const result = await onSubmit(newSplit);
        setPending(false);

        if (result instanceof Error) {
            setError(result.message);
        }
    };

    const onCancelClick = () => {
        setSplit({ name: "" });
        setError(null);
        onCancel();
    };

    const setSplitName = (name: string) => {
        setSplit((prev) => ({ ...prev, name }));
        setError(null);
    };

    const validateSplitName = (name: string) => {
        if (!name) {
            return "Split name cannot be empty.";
        }
        if (name.length < 3) {
            return "Split name must be at least 3 characters long.";
        }
        if (name.length > 50) {
            return "Split name must not exceed 50 characters.";
        }

        return null;
    };

    return (
        <CreateSplitContext.Provider
            value={{
                split,
                setSplitName,
                onSaveClick,
                onCancelClick,
                isPending: isPending,
                error,
                validationError,
            }}
        >
            {children}
        </CreateSplitContext.Provider>
    );
}

function FormInputs() {
    const { split, setSplitName, error, isPending, validationError } =
        useCreateSplitContext();

    const existsValidationError = validationError !== null;

    return (
        <>
            <FormControl sx={{ paddingTop: "5px" }} fullWidth>
                <TextField
                    autoFocus
                    required
                    id="split-name"
                    name="split-name"
                    label="Split name"
                    type="text"
                    value={split.name}
                    onChange={(e) => setSplitName(e.target.value)}
                    aria-label="Split name"
                    fullWidth
                    disabled={isPending}
                    error={existsValidationError}
                    helperText={existsValidationError && validationError}
                />
            </FormControl>
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </>
    );
}

function SubmitButton() {
    const { onSaveClick, isPending } = useCreateSplitContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSaveClick}
            loading={isPending}
        >
            Create
        </Button>
    );
}

function CancelButton() {
    const { onCancelClick, isPending } = useCreateSplitContext();

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onCancelClick}
            disabled={isPending}
        >
            Cancel
        </Button>
    );
}

function Title() {
    return "Create a new split";
}

function Description() {
    return "Please enter a name for the new split.";
}

const CreateSplit = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default CreateSplit;
