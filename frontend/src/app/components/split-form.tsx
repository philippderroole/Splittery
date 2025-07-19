import { CreateSplitDto } from "@/utils/split";
import { Button } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";
import SplitNameField from "./split-name-field";

type CreateSplitContextType = {
    split: CreateSplitDto;
    onSaveClick: () => void;
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

    const onSaveClick = async () => {
        if (isPending) return;

        const newSplit = { ...split, name: split.name.trim() };

        const nameError = validateSplitName(newSplit.name);
        const newErrors = new Map([["name", nameError]]);
        setValidationErrors(newErrors);

        if (nameError) {
            return;
        }

        setPending(true);
        await onSubmit(newSplit);
        setPending(false);
    };

    const onCancelClick = () => {
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
                onSaveClick,
                onCancelClick,
                isPending: isPending,
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

function SubmitButton(props: SubmitButtonProps) {
    const { onSaveClick, isPending } = useCreateSplitContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSaveClick}
            loading={isPending}
        >
            {props.content}
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
