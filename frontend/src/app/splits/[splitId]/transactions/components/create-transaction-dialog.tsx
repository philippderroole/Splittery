"use client";

import { createTransaction } from "@/actions/transaction-service";
import BaseForm from "@/components/base-form";
import AmountField from "@/components/form-fields/amount-field";
import NameField from "@/components/form-fields/name-field";
import MobileDialog from "@/components/mobile-dialog";
import TagSelection from "@/components/tag-selection";
import { useMembers } from "@/providers/member-provider";
import { useSplit } from "@/providers/split-provider";
import { useTags } from "@/providers/tag-provider";
import { CreateTransactionDto } from "@/utils/transaction";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    MenuItem,
    TextField,
} from "@mui/material";
import React, { useState } from "react";

interface CreateTransactionDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateTransactionDialog({
    open,
    onClose,
}: CreateTransactionDialogProps) {
    const split = useSplit();
    const members = useMembers();

    const [transaction, setTransaction] = useState<CreateTransactionDto>({
        name: "",
        amount: null,
        memberId: "",
        tagIds: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (transaction: CreateTransactionDto) => {
        setPending(true);

        try {
            await createTransaction(split.id, transaction);
            reset();
            onClose();
        } catch {
            setError("Failed to create transaction. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setTransaction({ name: "", amount: null, memberId: "", tagIds: [] });
        setError(null);
        setPending(false);
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
        setTransaction({ ...transaction, memberId: member.id });
    };

    return (
        <MobileDialog open={open} onClose={onClose}>
            <BaseForm.Root
                item={transaction}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                pending={isPending}
            >
                <DialogTitle>
                    <BaseForm.Title>Create a new transaction</BaseForm.Title>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <BaseForm.Description>
                            Create a new transaction for this split. You can add
                            tags to categorize the transaction.
                        </BaseForm.Description>
                    </DialogContentText>
                    <div style={{ marginTop: "16px" }} />
                    <FormInputs
                        transaction={transaction}
                        setName={setName}
                        setAmount={setAmount}
                        setPayee={setPayee}
                        setSelectedTags={setSelectedTags}
                        validationErrors={
                            new Map<string, string | null>([
                                ["name", null],
                                ["amount", null],
                                ["payee", null],
                            ])
                        }
                        isPending={isPending}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <BaseForm.CancelButton />
                    <BaseForm.SubmitButton>
                        <>Create</>
                    </BaseForm.SubmitButton>
                </DialogActions>
            </BaseForm.Root>
        </MobileDialog>
    );
}

export function CreateTransactionDialogButton() {
    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab color="primary" onClick={openDialog}>
                <ShoppingCartIcon />
            </Fab>
            <CreateTransactionDialog open={open} onClose={closeDialog} />
        </>
    );
}

interface FormInputsProps {
    transaction: CreateTransactionDto;
    validationErrors: Map<string, string | null>;
    isPending: boolean;
    setName: (name: string) => void;
    setAmount: (amount: string) => void;
    setPayee: (payee: string) => void;
    setSelectedTags: (tagIds: string[]) => void;
}

function FormInputs({
    transaction,
    validationErrors,
    isPending,
    setName,
    setAmount,
    setPayee,
    setSelectedTags,
}: FormInputsProps) {
    const members = useMembers();
    const tags = useTags();

    return (
        <>
            <NameField
                name={transaction.name}
                setName={setName}
                pending={isPending}
            />
            <AmountField
                amount={
                    transaction.amount
                        ? (transaction.amount / 100).toString()
                        : ""
                }
                setAmount={setAmount}
                pending={isPending}
            />
            <TextField
                required
                select
                margin="dense"
                id="transaction-payee"
                name="transaction-payee"
                label="Payee"
                value={
                    members.find((member) => member.id === transaction.memberId)
                        ?.name || ""
                }
                onChange={(e) => setPayee(e.target.value)}
                aria-label="Transaction payee"
                fullWidth
                disabled={isPending}
                error={validationErrors.get("payee") !== null}
                helperText={
                    validationErrors.get("payee") !== null &&
                    validationErrors.get("payee")
                }
            >
                {members.map((user) => (
                    <MenuItem key={user.id} value={user.name}>
                        {user.name}
                    </MenuItem>
                ))}
            </TextField>
            <TagSelection
                allTags={tags}
                selectedTags={transaction.tagIds}
                setSelectedTags={setSelectedTags}
                disabled={isPending}
            />
        </>
    );
}
