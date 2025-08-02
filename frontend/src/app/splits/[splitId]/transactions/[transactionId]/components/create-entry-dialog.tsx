"use client";

import { createEntry } from "@/actions/entry-service";
import BaseForm, { useFormContext } from "@/components/base-form";
import ChipSelector from "@/components/chip-selector";
import AmountField from "@/components/form-fields/amount-field";
import NameField from "@/components/form-fields/name-field";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { CreateEntryDto } from "@/utils/entry";
import { validateAmount, validateName } from "@/utils/validation";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";

interface CreateEntryDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateEntryDialog(props: CreateEntryDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();
    const transaction = useTransaction();

    const [entry, setEntry] = useState<CreateEntryDto>({
        name: "",
        amount: null,
        tagIds: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);
    const [validationErrors, setValidationErrors] = useState<
        Map<string, string | null>
    >(
        new Map<string, string | null>([
            ["name", null],
            ["amount", null],
        ])
    );

    const handleSubmit = async (entry: CreateEntryDto) => {
        setPending(true);
        setError(null);

        const validationErrors = validateEntry(entry);
        setValidationErrors(validationErrors);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationErrors.values().some((error) => error !== null)) {
            return;
        }

        try {
            await createEntry(split.id, transaction.id, entry);
            reset();
            onClose();
        } catch {
            setError("Failed to create entry. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setEntry({
            name: "",
            amount: null,
            tagIds: [],
        });
        setError(null);
        setPending(false);
    };

    const setName = (name: string) => {
        setEntry({ ...entry, name });
    };

    const setAmount = (amount: string) => {
        let newAmount;

        if (amount === "") {
            newAmount = null;
        } else {
            newAmount = Number(amount) * 100;
        }

        setEntry({ ...entry, amount: newAmount });
    };

    const setSelectedTags = (tagIds: string[]) => {
        setEntry({ ...entry, tagIds });
    };

    const validateEntry = (entry: CreateEntryDto) => {
        return new Map<string, string | null>([
            ["name", validateName(entry.name)],
            ["amount", validateAmount(entry.amount)],
        ]);
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <BaseForm.Root
                item={entry}
                onSubmit={handleSubmit}
                onCancel={onClose}
                pending={isPending}
            >
                <DialogTitle>
                    <BaseForm.Title>Create a new entry</BaseForm.Title>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <BaseForm.Description>
                            Create a new entry for this transaction. Entries are
                            used to split up transactions into smaller parts.
                        </BaseForm.Description>
                    </DialogContentText>
                    <div style={{ marginTop: "16px" }} />
                    <FormInputs
                        setName={setName}
                        setAmount={setAmount}
                        setSelectedTags={setSelectedTags}
                        validationErrors={validationErrors}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <BaseForm.CancelButton />
                    <BaseForm.SubmitButton>Create</BaseForm.SubmitButton>
                </DialogActions>
            </BaseForm.Root>
        </MobileDialog>
    );
}

interface FormInputsProps {
    setName: (name: string) => void;
    setAmount: (amount: string) => void;
    setSelectedTags: (tagIds: string[]) => void;
    validationErrors: Map<string, string | null>;
}

function FormInputs({
    setName,
    setAmount,
    setSelectedTags,
    validationErrors,
}: FormInputsProps) {
    const { item: entry, isPending } = useFormContext<CreateEntryDto>();

    return (
        <>
            <NameField
                name={entry.name}
                setName={setName}
                pending={isPending}
                error={validationErrors.get("name")}
            />
            <AmountField
                amount={entry.amount ? (entry.amount / 100).toString() : ""}
                setAmount={setAmount}
                pending={isPending}
                error={validationErrors.get("amount")}
            />
            <ChipSelector
                selectedTagIds={entry.tagIds}
                setSelectedTagIds={setSelectedTags}
            />
        </>
    );
}
