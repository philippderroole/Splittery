"use client";

import { useMembers } from "@/providers/member-provider";
import { CreateTransactionDto } from "@/utils/transaction";
import { Button } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type TransactionFormContextType = {
    transaction: CreateTransactionDto;
    setName: (name: string) => void;
    setAmount: (amount: string) => void;
    setPayee: (payee: string) => void;
    setSelectedTags: (tags: string[]) => void;
    validationErrors: Map<string, string | null>;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
};

const TransactionFormContext = createContext<TransactionFormContextType | null>(
    null
);

const useTransactionFormContext = () => {
    const currentTransactionContext = useContext(TransactionFormContext);

    if (!currentTransactionContext) {
        throw new Error(
            "useCreateTagContext must be used within a CreateTagContext.Provider"
        );
    }

    return currentTransactionContext;
};

interface TransactionFormCompoundProps {
    transaction: CreateTransactionDto;
    setTransaction: (transaction: CreateTransactionDto) => void;
    children?: ReactNode;
    onSubmit: (transaction: CreateTransactionDto) => Promise<Error | void>;
    onCancel: () => void;
    isPending: boolean;
}

function Root({
    transaction,
    setTransaction,
    children,
    onSubmit,
    onCancel,
    isPending,
}: TransactionFormCompoundProps) {
    const members = useMembers();

    const [validationErrors, setValidationErrors] = useState<
        Map<string, string | null>
    >(
        new Map<string, string | null>([
            ["name", null],
            ["amount", null],
            ["payee", null],
        ])
    );

    const handleSubmit = async () => {
        if (isPending) return;

        const newTransaction = {
            ...transaction,
            name: transaction.name.trim(),
        };

        const validationErrors = validateTransaction(newTransaction);
        setValidationErrors(validationErrors);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationErrors.values().some((error) => error !== null)) {
            return;
        }

        await onSubmit(newTransaction);
    };

    const setName = (name: string) => {
        setTransaction({ ...transaction, name });
    };

    const setSelectedTags = (tagIds: string[]) => {
        setTransaction({ ...transaction, tagIds });
    };

    const setAmount = (amount: string) => {
        let newAmount;

        if (amount === "") {
            newAmount = null;
        } else {
            newAmount = Number(amount) * 100;
        }

        setTransaction({ ...transaction, amount: newAmount });
    };

    const setPayee = (name: string) => {
        const member = members.find((member) => member.name === name)!;
        setTransaction({ ...transaction, memberId: member.id || null });
    };

    const validateTransactionName = (name: string) => {
        if (!name) {
            return "Transaction name cannot be empty.";
        }
        if (name.length < 3) {
            return "Transaction name must be at least 3 characters long.";
        }
        if (name.length > 50) {
            return "Transaction name must not exceed 50 characters.";
        }

        return null;
    };

    const validateTransactionAmount = (
        amount: CreateTransactionDto["amount"]
    ) => {
        if (amount === null || amount === undefined) {
            return "Amount is required.";
        }
        if (amount < -1000000 || amount > 1000000) {
            return "Amount must be between -1,000,000 and 1,000,000.";
        }
        if (amount === 0) {
            return "Amount cannot be zero.";
        }

        return null;
    };

    const validatePayee = (payee: string | null) => {
        if (!payee || payee === undefined) {
            return "Payee is required.";
        }

        return null;
    };

    const validateTransaction = (transaction: CreateTransactionDto) => {
        const nameError = validateTransactionName(transaction.name);
        const amountError = validateTransactionAmount(transaction.amount);
        const payeeError = validatePayee(transaction.memberId);

        return new Map<string, string | null>([
            ["name", nameError],
            ["amount", amountError],
            ["payee", payeeError],
        ]);
    };

    return (
        <TransactionFormContext.Provider
            value={{
                transaction,
                setName,
                setAmount,
                setPayee,
                setSelectedTags,
                onSubmit: handleSubmit,
                onCancel,
                isPending,
                validationErrors,
            }}
        >
            {children}
        </TransactionFormContext.Provider>
    );
}

interface SubmitButtonProps {
    content: ReactNode;
}

function SubmitButton({ content }: SubmitButtonProps) {
    const { onSubmit, isPending } = useTransactionFormContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            loading={isPending}
        >
            <>{content}</>
        </Button>
    );
}

function CancelButton() {
    const { onCancel: onCancelClick, isPending } = useTransactionFormContext();

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onCancelClick}
            disabled={isPending}
        >
            <>Cancel</>
        </Button>
    );
}

interface TitleProps {
    content: ReactNode | string;
}

function Title(props: TitleProps) {
    return <>{props.content}</>;
}

interface DescriptionProps {
    content: ReactNode | string;
}

function Description(props: DescriptionProps) {
    return <>{props.content}</>;
}

const TransactionForm = {
    Root,
    Title,
    Description,
    CancelButton,
    SubmitButton,
};

export default TransactionForm;
