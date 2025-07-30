"use client";

import { Button } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

function initFormContext<T>() {
    type FormContextType = {
        onDeleteClick: () => void;
        onCancelClick: () => void;
        isPending: boolean;
        item: T;
    };

    const FormContext = createContext<FormContextType | null>(null);

    function useFormContext(): FormContextType {
        const currentFormContext = useContext(FormContext);

        if (!currentFormContext) {
            throw new Error(
                "useFormContext must be used within a DeleteTagContext.Provider"
            );
        }

        return currentFormContext;
    }

    return { FormContext, useFormContext };
}

const { FormContext, useFormContext } = initFormContext();

interface FormCompoundProps<T> {
    item: T;
    children?: ReactNode;
    onSubmit: (item: T) => Promise<Error | void>;
    onCancel: () => void;
    pending?: boolean;
}

function Root<T>(props: FormCompoundProps<T>) {
    const { item, children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);

    const onDeleteClick = async () => {
        if (isPending) return;

        setPending(true);
        await onSubmit(item);
        setPending(false);
    };

    const onCancelClick = () => {
        onCancel();
    };

    return (
        <FormContext.Provider
            value={{
                onDeleteClick,
                onCancelClick,
                isPending,
                item,
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

interface ButtonProps {
    children?: ReactNode;
}

function SubmitButton({ children }: ButtonProps) {
    const { onDeleteClick, isPending } = useFormContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onDeleteClick}
            loading={isPending}
        >
            {children}
        </Button>
    );
}

function CancelButton() {
    const { onCancelClick, isPending } = useFormContext();

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

interface TitleProps {
    children?: ReactNode;
}

function Title({ children }: TitleProps) {
    return <>{children}</>;
}

interface DescriptionProps {
    children?: ReactNode;
}

function Description({ children }: DescriptionProps) {
    return <>{children}</>;
}

const BaseForm = {
    Root,
    Title,
    Description,
    CancelButton,
    SubmitButton,
};

export default BaseForm;
