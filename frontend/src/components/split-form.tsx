import { CreateSplitDto } from "@/utils/split";
import { Button } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";
import SplitNameField from "../app/components/split-name-field";

type CreateSplitContextType = {
    split: CreateSplitDto;
    onSubmit: () => void;
    onCancelClick: () => void;
    setSplitName: (name: string) => void;
    isPending: boolean;
    validationErrors: Map<string, string | null>;
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
    split: CreateSplitDto;
    setSplit: (split: CreateSplitDto) => void;
    children?: ReactNode;
    onSubmit: (split: CreateSplitDto) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: CreateSplitCompoundProps) {
    const { split, setSplit, children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);

    const [validationErrors, setValidationErrors] = useState<
        Map<string, string | null>
    >(new Map());

    const handleSubmit = async () => {
        if (isPending) return;

        const newSplit = { ...split, name: split.name.trim() };

        const nameError = validateSplitName(newSplit.name);
        const validationErrors = new Map([["name", nameError]]);
        setValidationErrors(validationErrors);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationErrors.values().some((error) => error !== null)) {
            return;
        }

        setPending(true);
        await onSubmit(newSplit);
        setPending(false);
    };

    const handleCancel = () => {
        resetForm();
        onCancel();
    };

    const resetForm = () => {
        setSplit({ name: "" });
        setValidationErrors(new Map());
    };

    const setSplitName = (name: string) => {
        setSplit((prev: CreateSplitDto) => ({ ...prev, name }));
        setValidationErrors((prev) => {
            const newErrors = new Map(prev);
            newErrors.set("name", null);
            return newErrors;
        });
    };

    return (
        <CreateSplitContext.Provider
            value={{
                split,
                setSplitName,
                onSubmit: handleSubmit,
                onCancelClick: handleCancel,
                isPending,
                validationErrors,
            }}
        >
            {children}
        </CreateSplitContext.Provider>
    );
}

export function validateSplitName(name: string) {
    if (!name) return "Split name cannot be empty.";
    if (name.length < 3)
        return "Split name must be at least 3 characters long.";
    if (name.length > 50) return "Split name must not exceed 50 characters.";
    return null;
}

function FormInputs() {
    const { split, setSplitName, isPending, validationErrors } =
        useCreateSplitContext();

    return (
        <>
            <SplitNameField
                value={split.name}
                onChange={setSplitName}
                error={validationErrors.get("name") || null}
                disabled={isPending}
            />
        </>
    );
}

interface SubmitButtonProps {
    content: string;
}

function SubmitButton({ content }: SubmitButtonProps) {
    const { onSubmit, isPending } = useCreateSplitContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            loading={isPending}
        >
            {content}
        </Button>
    );
}

interface CancelButtonProps {
    content: string;
}

function CancelButton({ content }: CancelButtonProps) {
    const { onCancelClick, isPending } = useCreateSplitContext();

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onCancelClick}
            disabled={isPending}
        >
            {content}
        </Button>
    );
}

function Title() {
    return <>Create a new split</>;
}

function Description() {
    return <>Please enter a name for the new split.</>;
}

const SplitForm = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default SplitForm;
