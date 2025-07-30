"use client";

import { editEntry } from "@/actions/entry-service";
import BaseForm, { useFormContext } from "@/components/base-form";
import ChipSelector from "@/components/chip-selector";
import AmountField from "@/components/form-fields/amount-field";
import NameField from "@/components/form-fields/name-field";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { EditEntityDto as EditEntryDto, Entry } from "@/utils/entry";
import { Transaction } from "@/utils/transaction";
import { validateAmount, validateName } from "@/utils/validation";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import DeleteEntryDialogButton from "./delete-entry-dialog-button";

interface EditEntryDialogProps {
    entry: Entry;
    transaction: Transaction;
    open: boolean;
    onClose: () => void;
}

export function EditEntryDialog({
    entry: initalEntry,
    transaction,
    open,
    onClose,
}: EditEntryDialogProps) {
    const split = useSplit();

    const [entry, setEntry] = useState<EditEntryDto>({
        ...initalEntry,
        amount: initalEntry.amount.getAmount(),
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

    const handleSubmit = async (entry: EditEntryDto) => {
        setPending(true);
        setError(null);

        const validationErrors = validateEntry(entry);
        setValidationErrors(validationErrors);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationErrors.values().some((error) => error !== null)) {
            return;
        }

        try {
            await editEntry(split.id, transaction.id, entry);
            reset();
            onClose();
        } catch {
            setError("Failed to edit entry. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setEntry({
            ...initalEntry,
            amount: initalEntry.amount.getAmount(),
            tagIds: initalEntry.tagIds,
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

    const validateEntry = (entry: EditEntryDto) => {
        return new Map<string, string | null>([
            ["name", validateName(entry.name)],
            ["amount", validateAmount(entry.amount)],
        ]);
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <BaseForm.Root<EditEntryDto>
                item={entry}
                onSubmit={handleSubmit}
                onCancel={onClose}
                pending={isPending}
            >
                <DialogTitle>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <BaseForm.Title>
                            Edit Entry: {initalEntry.name}
                        </BaseForm.Title>
                        <DeleteEntryDialogButton
                            entry={initalEntry}
                            transaction={transaction}
                        />
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <BaseForm.Description>
                            Edit the details of this entry. Entries are used to
                            split up transactions into smaller parts.
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
                    <BaseForm.SubmitButton>Save</BaseForm.SubmitButton>
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
    const { item: entry, isPending } = useFormContext<EditEntryDto>();

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
