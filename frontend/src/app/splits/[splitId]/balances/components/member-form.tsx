"use client";

import { useTags } from "@/providers/tag-provider";
import { CreateMemberDto } from "@/utils/user";
import { Alert, Button, FormControl, TextField } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type MemberFormContextType = {
    member: CreateMemberDto;
    onSaveClick: () => void;
    onCancelClick: () => void;
    setMemberName: (name: string) => void;
    isPending: boolean;
    error: string | null;
    validationError: string | null;
};

const MemberFormContext = createContext<MemberFormContextType | null>(null);

const useMemberFormContext = () => {
    const currentMemberContext = useContext(MemberFormContext);

    if (!currentMemberContext) {
        throw new Error(
            "useMemberFormContext must be used within a MemberFormContext.Provider"
        );
    }

    return currentMemberContext;
};

interface MemberFormCompoundProps {
    member: CreateMemberDto;
    setMember: (member: CreateMemberDto) => void;
    children?: ReactNode;
    onSubmit: (member: CreateMemberDto) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: MemberFormCompoundProps) {
    const { member, setMember, children, onSubmit, onCancel } = props;

    const tags = useTags();

    const [isPending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const onSaveClick = async () => {
        if (isPending) return;

        const newMember = { ...member, name: member.name.trim() };

        const validationError = validateMemberName(newMember.name);
        setValidationError(validationError);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationError) {
            return;
        }

        setPending(true);
        setError(null);
        const result = await onSubmit(newMember);
        setPending(false);

        if (result instanceof Error) {
            setError(result.message);
        }
    };

    const onCancelClick = () => {
        setMember({ name: "" });
        setError(null);
        setValidationError(null);
        onCancel();
    };

    const setMemberName = (name: string) => {
        setMember((prev: CreateMemberDto) => ({ ...prev, name }));
        setError(null);
    };

    const validateMemberName = (name: string) => {
        if (!name) {
            return "Username name cannot be empty.";
        }
        if (name.length < 3) {
            return "Username name must be at least 3 characters long.";
        }
        if (name.length > 50) {
            return "Username name must not exceed 50 characters.";
        }
        if (tags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())) {
            return "A tag with this name already exists. Please choose a different name or rename the existing tag.";
        }

        return null;
    };

    return (
        <MemberFormContext.Provider
            value={{
                member,
                setMemberName,
                onSaveClick,
                onCancelClick,
                isPending,
                error,
                validationError,
            }}
        >
            {children}
        </MemberFormContext.Provider>
    );
}

function FormInputs() {
    const { member, setMemberName, error, isPending, validationError } =
        useMemberFormContext();

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
                    value={member.name}
                    onChange={(e) => setMemberName(e.target.value)}
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
    const { onSaveClick, isPending } = useMemberFormContext();

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
    const { onCancelClick, isPending } = useMemberFormContext();

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
    return "Create a new member";
}

function Description() {
    return "Please enter a username for the new member.";
}

const MemberForm = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default MemberForm;
