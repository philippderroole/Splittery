"use client";

import { updateTransaction } from "@/actions/transaction-service";
import BaseForm from "@/components/base-form";
import AmountField from "@/components/form-fields/amount-field";
import NameField from "@/components/form-fields/name-field";
import MobileDialog from "@/components/mobile-dialog";
import TagSelection from "@/components/tag-selection";
import { useMembers } from "@/providers/member-provider";
import { useSplit } from "@/providers/split-provider";
import { useTags } from "@/providers/tag-provider";
import { Transaction, UpdateTransactionDto } from "@/utils/transaction";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
} from "@mui/material";
import { useState } from "react";
import TransactionForm from "../../../../../../components/transaction-form";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";

interface EditTransactionDialogProps {
    transaction: Transaction;
    open: boolean;
    onClose: () => void;
}

export function EditTransactionDialog({
    transaction: initalTransaction,
    open,
    onClose,
}: EditTransactionDialogProps) {
    const split = useSplit();
    const members = useMembers();

    const [transaction, setTransaction] = useState<UpdateTransactionDto>({
        ...initalTransaction,
        amount: initalTransaction.amount.getAmount(),
        tagIds: initalTransaction.tagIds,
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (transaction: UpdateTransactionDto) => {
        setPending(true);

        try {
            await updateTransaction(split.id, transaction);
            setPending(false);
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
        setTransaction({
            ...initalTransaction,
            amount: initalTransaction.amount.getAmount(),
            memberId: initalTransaction.memberId,
            tagIds: initalTransaction.tagIds,
        });
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
        <MobileDialog open={open} onClose={handleCancel}>
            <BaseForm.Root<UpdateTransactionDto>
                item={transaction}
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
                        <TransactionForm.Title content={"Edit transaction"} />
                        <DeleteButton transaction={initalTransaction} />
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <BaseForm.Description>
                            <>Edit</>
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
                        <>Save</>
                    </BaseForm.SubmitButton>
                </DialogActions>
            </BaseForm.Root>
        </MobileDialog>
    );
}

interface DeleteButtonProps {
    transaction: Transaction;
}

function DeleteButton({ transaction }: DeleteButtonProps) {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={openDialog}>
                <DeleteIcon />
            </IconButton>
            <DeleteTransactionDialog
                transaction={transaction}
                open={open}
                onClose={handleCancel}
            />
        </>
    );
}

interface FormInputsProps {
    transaction: UpdateTransactionDto;
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
