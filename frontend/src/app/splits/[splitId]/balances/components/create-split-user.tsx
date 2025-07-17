"use client";

import { CreateMemberDto } from "@/utils/user";
import { Alert, Button, FormControl, TextField } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type CreateUserContextType = {
    user: CreateMemberDto;
    onSaveClick: () => void;
    onCancelClick: () => void;
    setUsername: (name: string) => void;
    isPending: boolean;
    error: string | null;
    validationError: string | null;
};

const CreateUserContext = createContext<CreateUserContextType | null>(null);

const useCreateUserContext = () => {
    const currentUserContext = useContext(CreateUserContext);

    if (!currentUserContext) {
        throw new Error(
            "useCreateUserContext must be used within a CreateUserContext.Provider"
        );
    }

    return currentUserContext;
};

interface CreateUserCompoundProps {
    children?: ReactNode;
    onSubmit: (user: CreateMemberDto) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: CreateUserCompoundProps) {
    const { children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);
    const [user, setUser] = useState<CreateMemberDto>({ username: "" });
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const onSaveClick = async () => {
        if (isPending) return;

        const newUser = { ...user, name: user.username.trim() };

        const validationError = validateUserName(newUser.name);
        setValidationError(validationError);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationError) {
            return;
        }

        console.log("Submitting user:", newUser);

        setPending(true);
        setError(null);
        const result = await onSubmit(newUser);
        setPending(false);

        if (result instanceof Error) {
            setError(result.message);
        }
    };

    const onCancelClick = () => {
        setUser({ username: "" });
        setError(null);
        onCancel();
    };

    const setUsername = (username: string) => {
        setUser((prev) => ({ ...prev, username }));
        setError(null);
    };

    const validateUserName = (name: string) => {
        if (!name) {
            return "Username name cannot be empty.";
        }
        if (name.length < 3) {
            return "Username name must be at least 3 characters long.";
        }
        if (name.length > 50) {
            return "Username name must not exceed 50 characters.";
        }

        return null;
    };

    return (
        <CreateUserContext.Provider
            value={{
                user,
                setUsername,
                onSaveClick,
                onCancelClick,
                isPending,
                error,
                validationError,
            }}
        >
            {children}
        </CreateUserContext.Provider>
    );
}

function FormInputs() {
    const { user, setUsername, error, isPending, validationError } =
        useCreateUserContext();

    const existsValidationError = validationError !== null;

    return (
        <>
            <FormControl sx={{ paddingTop: "5px" }} fullWidth>
                <TextField
                    autoFocus
                    required
                    id="user-name"
                    name="user-name"
                    label="Username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-label="Username"
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
    const { onSaveClick, isPending } = useCreateUserContext();

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
    const { onCancelClick, isPending } = useCreateUserContext();

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
    return "Create a new user";
}

function Description() {
    return "Please enter a username for the new user.";
}

const CreateUser = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default CreateUser;
