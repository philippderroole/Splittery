"use client";

import { useMembers } from "@/providers/member-provider";
import { useSplit } from "@/providers/split-provider";
import { useTags } from "@/providers/tag-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { getFormattedDateLong } from "@/utils/date-formatter";
import { Entry } from "@/utils/entry";
import { Money } from "@/utils/money";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
    Avatar,
    Box,
    Button,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import CreateEntryDialogFAB from "./components/create-entry-dialog-button";
import { EditEntryDialog } from "./components/edit-entry-dialog";
import { EditTransactionDialog } from "./components/edit-transaction-dialog";

export default function TransactionPage() {
    const split = useSplit();
    const transaction = useTransaction();

    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    const remainingAmount: Money = transaction.entries.reduce(
        (acc, entry) => acc.subtract(entry.amount),
        transaction.amount
    );

    return (
        <>
            <Link href={`/splits/${split.id}/transactions`}>
                <IconButton>
                    <ArrowBackIosIcon />
                </IconButton>
            </Link>
            <TransactionHeader onClick={openDialog} />
            <List>
                {transaction.entries.map((entry) => (
                    <EntryListItem key={entry.id} entry={entry}></EntryListItem>
                ))}
                <RemainingEntryListItem
                    remainingAmount={remainingAmount}
                    selectedTagIds={transaction.tagIds}
                    onClick={openDialog}
                />
                <ListItem sx={{ minHeight: "140px" }} />
            </List>
            <CreateEntryDialogFAB />
            <EditTransactionDialog
                open={open}
                onClose={closeDialog}
                transaction={transaction}
            />
        </>
    );
}

interface TransactionHeaderProps {
    onClick?: () => void;
}

function TransactionHeader({ onClick }: TransactionHeaderProps) {
    const transaction = useTransaction();
    const members = useMembers();

    const payer = members.find((member) => member.id === transaction.memberId)!;
    return (
        <>
            <Button
                onClick={onClick}
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 1,
                    textTransform: "none",
                    color: "inherit",
                    padding: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                    }}
                >
                    <Typography variant="caption" color="textSecondary">
                        {payer.name} payed
                    </Typography>
                    <Typography variant="h4">
                        {transaction.amount.toString()}
                    </Typography>
                    <Typography variant="body1">{transaction.name}</Typography>
                    <Typography variant="caption">
                        {getFormattedDateLong(transaction.executedAt)}
                    </Typography>
                </Box>
                <Avatar />
            </Button>
        </>
    );
}

interface RemainingEntryListItemProps {
    remainingAmount: Money;
    selectedTagIds: string[];
    onClick?: () => void;
}

function RemainingEntryListItem({
    remainingAmount,
    selectedTagIds,
    onClick,
}: RemainingEntryListItemProps) {
    const tags = useTags();

    return (
        <ListItemButton onClick={onClick}>
            <ListItem
                disablePadding
                secondaryAction={
                    <Typography>{remainingAmount.toString()}</Typography>
                }
            >
                <ListItemText
                    primary="Remaining"
                    secondary={
                        <Box sx={{ display: "flex", gap: "2px" }}>
                            {selectedTagIds.map((id) => {
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
                />
            </ListItem>
        </ListItemButton>
    );
}

interface EntryItemProps {
    entry: Entry;
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
            <EditEntryDialog
                entry={entry}
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
