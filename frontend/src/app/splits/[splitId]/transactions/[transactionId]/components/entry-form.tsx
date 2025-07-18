"use client";

import { useTags } from "@/providers/tag-provider";
import { CreateEntryDto, TransactionEntry as Entry } from "@/utils/entry";
import { Tag } from "@/utils/tag";
import { CreateTransactionDto } from "@/utils/transaction";
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
    OutlinedInput,
    TextField,
} from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type EntryFormContextType = {
    entry: CreateEntryDto;
    setName: (name: string) => void;
    setAmount: (amount: string) => void;
    setSelectedTags: (tags: string[]) => void;
    isPending: boolean;
    error: string | null;
    validationErrors: Map<string, string | null>;
    onSaveClick: () => void;
    onCancelClick: () => void;
};

const EntryFormContext = createContext<EntryFormContextType | null>(null);

const useEntryFormContext = () => {
    const currentTransactionContext = useContext(EntryFormContext);

    if (!currentTransactionContext) {
        throw new Error(
            "useCreateTagContext must be used within a CreateTagContext.Provider"
        );
    }

    return currentTransactionContext;
};

interface EntryFormCompoundProps {
    initalEntry?: Entry;
    children?: ReactNode;
    onSubmit: (transaction: CreateEntryDto) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: EntryFormCompoundProps) {
    const { initalEntry, children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);
    const [entry, setEntry] = useState<CreateEntryDto>(
        initalEntry
            ? {
                  ...initalEntry,
                  amount: initalEntry.amount.getAmount(),
              }
            : {
                  name: "",
                  amount: null,
                  tagIds: [],
              }
    );
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<
        Map<string, string | null>
    >(
        new Map<string, string | null>([
            ["name", null],
            ["amount", null],
        ])
    );

    const onSaveClick = async () => {
        if (isPending) return;

        const newEntry = {
            ...entry,
            name: entry.name.trim(),
        };

        const validationErrors = validateEntry(newEntry);
        setValidationErrors(validationErrors);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationErrors.values().some((error) => error !== null)) {
            return;
        }

        setPending(true);
        setError(null);
        const result = await onSubmit(newEntry);
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
        setEntry({ name: "", amount: null, tagIds: [] });
        setError(null);
        setValidationErrors(
            new Map<string, string | null>([
                ["name", null],
                ["amount", null],
            ])
        );
    };

    const setName = (name: string) => {
        setEntry((prev) => ({ ...prev, name }));
        setError(null);
    };

    const setAmount = (amount: string) => {
        let newAmount;

        if (amount === "") {
            newAmount = null;
        } else {
            newAmount = Number(amount);
        }

        setEntry((prev) => ({ ...prev, amount: newAmount }));
        setError(null);
    };

    const setSelectedTags = (tagIds: string[]) => {
        setEntry((prev) => ({ ...prev, tagIds }));
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

    const validateEntry = (transaction: CreateEntryDto) => {
        const nameError = validateTransactionName(transaction.name);
        const amountError = validateTransactionAmount(transaction.amount);

        return new Map<string, string | null>([
            ["name", nameError],
            ["amount", amountError],
        ]);
    };

    return (
        <EntryFormContext.Provider
            value={{
                entry,
                setName,
                setAmount,
                setSelectedTags,
                isPending,
                error,
                validationErrors,
                onSaveClick,
                onCancelClick,
            }}
        >
            {children}
        </EntryFormContext.Provider>
    );
}

function FormInputs() {
    const { entry, setName, setAmount, error, isPending, validationErrors } =
        useEntryFormContext();

    return (
        <>
            <TextField
                autoFocus
                required
                margin="dense"
                id="entry-name"
                name="entry-name"
                label="Entry name"
                type="text"
                value={entry.name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Entry name"
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
                    id="entry-amount"
                    name="entry-amount"
                    label="Entry amount"
                    type="number"
                    value={entry.amount == null ? "" : entry.amount}
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
    const { entry, setSelectedTags } = useEntryFormContext();

    const tags = useTags();

    const addTag = (tag: Tag) => {
        if (entry.tagIds.includes(tag.id)) {
            return;
        }
        setSelectedTags([...entry.tagIds, tag.id]);
    };

    const removeTag = (tag: Tag) => {
        setSelectedTags(entry.tagIds.filter((id) => id !== tag.id));
    };

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => {
                const selected = entry.tagIds.some((id) => id === tag.id);

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
                            selected ? removeTag(tag) : addTag(tag);
                        }}
                        onDelete={() => {
                            selected ? removeTag(tag) : addTag(tag);
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
    const { onSaveClick, isPending } = useEntryFormContext();

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
    const { onCancelClick, isPending } = useEntryFormContext();

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

const EntryForm = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default EntryForm;
