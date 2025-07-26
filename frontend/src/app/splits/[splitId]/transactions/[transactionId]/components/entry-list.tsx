"use client";

import { useTags } from "@/providers/tag-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { TransactionEntry } from "@/utils/entry";
import { Money } from "@/utils/money";
import {
    Box,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { EditTransactionDialog } from "./edit-transaction-dialog";

export default function EntryList() {
    const transaction = useTransaction();

    const remainingAmount: Money = transaction.entries.reduce(
        (acc, entry) => acc.subtract(entry.amount),
        transaction.amount
    );

    return (
        <>
            <List>
                <RemainingEntryListItem
                    remainingAmount={remainingAmount}
                    tagIds={transaction.tags.map((tag) => tag.id)}
                />
                {transaction.entries.map((entry) => (
                    <EntryListItem key={entry.id} entry={entry}></EntryListItem>
                ))}
            </List>
        </>
    );
}

interface RemainingEntryListItemProps {
    remainingAmount: Money;
    tagIds: string[];
}

function RemainingEntryListItem({
    remainingAmount,
    tagIds,
}: RemainingEntryListItemProps) {
    const tags = useTags();

    return (
        <ListItem
            secondaryAction={
                <Typography sx={{ paddingRight: "16px" }}>
                    {remainingAmount.toString()}
                </Typography>
            }
        >
            <ListItemText
                secondary={
                    <Box sx={{ display: "flex", gap: "2px" }}>
                        {tagIds.map((id) => {
                            const tag = tags.find((tag) => tag.id === id)!;
                            return (
                                <Chip
                                    key={id}
                                    label={tag.name}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                        backgroundColor: tag.color,
                                        mt: 0.5,
                                    }}
                                />
                            );
                        })}
                    </Box>
                }
            >
                Remaining
            </ListItemText>
        </ListItem>
    );
}

interface EntryItemProps {
    entry: TransactionEntry;
}

function EntryListItem(props: EntryItemProps) {
    const { entry } = props;

    const tags = useTags();
    const transaction = useTransaction();

    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <EditTransactionDialog
                transaction={transaction}
                open={open}
                onClose={closeDialog}
            />
            <ListItemButton onClick={openDialog}>
                <ListItem
                    disablePadding
                    secondaryAction={
                        <Typography>{entry.amount.toString()}</Typography>
                    }
                >
                    <ListItemText
                        primary={entry.name}
                        secondary={
                            <Box sx={{ display: "flex", gap: "2px" }}>
                                {entry.tagIds.map((id) => {
                                    const tag = tags.find(
                                        (tag) => tag.id === id
                                    )!;
                                    return (
                                        <Chip
                                            key={id}
                                            label={tag.name}
                                            size="small"
                                            variant="filled"
                                            sx={{
                                                backgroundColor: tag.color,
                                                mt: 0.5,
                                            }}
                                        />
                                    );
                                })}
                            </Box>
                        }
                    />
                </ListItem>
            </ListItemButton>
        </>
    );
}
