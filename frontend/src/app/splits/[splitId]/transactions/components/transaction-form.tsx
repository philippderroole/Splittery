"use client";

import { useSplitUsers } from "@/providers/split-user-provider";
import { useTags } from "@/providers/tag-provider";
import { Tag } from "@/utils/tag";
import { CreateTransactionDto, Transaction } from "@/utils/transaction";
import CheckIcon from "@mui/icons-material/Check";
import {
    Alert,
    Box,
    Button,
    Chip,
    FormControl,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    TextField,
} from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type TransactionFormContextType = {
    transaction: CreateTransactionDto;
    setName: (name: string) => void;
    setAmount: (amount: string) => void;
    setPayee: (payee: string) => void;
    selectedTags: Tag[];
    setSelectedTags: (tags: Tag[]) => void;
    isPending: boolean;
    error: string | null;
    validationErrors: Map<string, string | null>;
    onSaveClick: () => void;
    onCancelClick: () => void;
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
    initalTransaction?: Transaction;
    children?: ReactNode;
    onSubmit: (
        transaction: CreateTransactionDto,
        tags: Tag[]
    ) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: TransactionFormCompoundProps) {
    const { initalTransaction, children, onSubmit, onCancel } = props;

    const tags = useTags();
    const members = useSplitUsers();

    const [isPending, setPending] = useState(false);
    const [transaction, setTransaction] = useState<CreateTransactionDto>(
        initalTransaction
            ? {
                  ...initalTransaction,
                  amount: initalTransaction.amount.getAmount(),
                  memberId: "",
              }
            : {
                  name: "",
                  amount: null,
                  memberId: "",
                  tags: [],
              }
    );
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Map<string, string | null>
    >(
        new Map<string, string | null>([
            ["name", null],
            ["amount", null],
            ["payee", null],
        ])
    );

    const onSaveClick = async () => {
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

        setPending(true);
        setError(null);
        const result = await onSubmit(newTransaction, selectedTags);
        setPending(false);

        if (result instanceof Error) {
            setError(result.message);
            return;
        }

        clearTransaction();
        onCancel();
    };

    const onCancelClick = () => {
        clearTransaction();
        onCancel();
    };

    const clearTransaction = () => {
        setTransaction({ name: "", amount: null, memberId: "", tags: [] });
        setError(null);
        setValidationErrors(
            new Map<string, string | null>([
                ["name", null],
                ["amount", null],
                ["payee", null],
            ])
        );
    };

    const setName = (name: string) => {
        setTransaction((prev) => ({ ...prev, name }));
        setError(null);
    };

    const setAmount = (amount: string) => {
        let newAmount;

        if (amount === "") {
            newAmount = null;
        } else {
            newAmount = Number(amount);
        }

        setTransaction((prev) => ({ ...prev, amount: newAmount }));
        setError(null);
    };

    const setPayee = (name: string) => {
        const member = members.find((user) => user.name === name);
        setTransaction((prev) => ({ ...prev, memberId: member?.id || null }));
        setError(null);
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
                selectedTags,
                setSelectedTags,
                isPending,
                error,
                validationErrors,
                onSaveClick,
                onCancelClick,
            }}
        >
            {children}
        </TransactionFormContext.Provider>
    );
}

function FormInputs() {
    const {
        transaction,
        setName,
        setAmount,
        setPayee,
        error,
        isPending,
        validationErrors,
    } = useTransactionFormContext();

    const users = useSplitUsers();

    return (
        <>
            <TextField
                autoFocus
                required
                margin="dense"
                id="transaction-name"
                name="transaction-name"
                label="Transaction name"
                type="text"
                value={transaction.name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Transaction name"
                fullWidth
                disabled={isPending}
                error={validationErrors.get("name") !== null}
                helperText={
                    validationErrors.get("name") !== null &&
                    validationErrors.get("name")
                }
            />
            <FormControl
                required
                fullWidth
                margin="dense"
                id="amount"
                error={validationErrors.get("amount") !== null}
                disabled={isPending}
            >
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <OutlinedInput
                    id="transaction-amount"
                    name="transaction-amount"
                    label="Transaction amount"
                    type="number"
                    value={transaction.amount == null ? "" : transaction.amount}
                    onChange={(e) => setAmount(e.target.value)}
                    startAdornment={
                        <InputAdornment position="start">-</InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">€</InputAdornment>
                    }
                />
                <FormHelperText>
                    {validationErrors.get("amount") !== null &&
                        validationErrors.get("amount")}
                </FormHelperText>
            </FormControl>
            <TextField
                required
                select
                margin="dense"
                id="transaction-payee"
                name="transaction-payee"
                label="Payee/Receiver"
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
                {users.map((user) => (
                    <MenuItem key={user.id} value={user.name}>
                        {user.name}
                    </MenuItem>
                ))}
            </TextField>
            <ChipList />
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </>
    );
}

function ChipList() {
    const { selectedTags, setSelectedTags } = useTransactionFormContext();

    const tags = useTags();

    const addTag = (tag: Tag) => {
        setSelectedTags([...selectedTags, tag]);
    };

    const removeTag = (tag: Tag) => {
        setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    };

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => {
                const selected = selectedTags.some((t) => t.id === tag.id);

                return (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        variant={selected ? "filled" : "outlined"}
                        deleteIcon={selected ? <CheckIcon /> : <div />}
                        sx={{
                            mt: 0.5,
                            backgroundColor: selected
                                ? tag.color
                                : "transparent",
                            borderColor: tag.color,
                            color: selected ? "white" : tag.color,
                            "&:hover": {
                                backgroundColor: selected
                                    ? tag.color
                                    : `${tag.color}20`, // 20% opacity
                            },
                            "&:active": {
                                backgroundColor: selected
                                    ? tag.color
                                    : `${tag.color}40`, // 40% opacity
                            },
                            "&.MuiChip-filled": {
                                "&:hover": {
                                    backgroundColor: tag.color,
                                    filter: "brightness(0.9)",
                                },
                                "&:active": {
                                    backgroundColor: tag.color,
                                    filter: "brightness(0.8)",
                                },
                            },
                        }}
                        onClick={() => {
                            selected ? removeTag(tag) : addTag(tag); // eslint-disable-line @typescript-eslint/no-unused-expressions
                        }}
                        onDelete={() => {
                            selected ? removeTag(tag) : addTag(tag); // eslint-disable-line @typescript-eslint/no-unused-expressions
                        }}
                    />
                );
            })}
        </Box>
    );
}

interface SubmitButtonProps {
    content: ReactNode | string;
}

function SubmitButton(props: SubmitButtonProps) {
    const { onSaveClick, isPending } = useTransactionFormContext();

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
    const { onCancelClick, isPending } = useTransactionFormContext();

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
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default TransactionForm;
