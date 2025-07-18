"use client";

import { useTags } from "@/providers/tag-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { Currencies } from "@/utils/currencies";
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

    const remainingAmount: Money =
        transaction.entries.find((item) => item.name === "Remaining")?.amount ??
        new Money(0, Currencies.EUR);

    return (
        <>
            <List>
                <ListItem
                    secondaryAction={
                        <Typography sx={{ paddingRight: "16px" }}>
                            {remainingAmount.toString()}
                        </Typography>
                    }
                >
                    <ListItemText>Remaining</ListItemText>
                </ListItem>
                {transaction.entries.map((entry) => (
                    <EntryItem key={entry.id} entry={entry}></EntryItem>
                ))}
            </List>
        </>
    );
}

interface EntryItemProps {
    entry: TransactionEntry;
}

function EntryItem(props: EntryItemProps) {
    const { entry } = props;

    const tags = useTags();

    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <EditTransactionDialog open={open} onClose={closeDialog} />
            <ListItemButton onClick={openDialog}>
                <ListItem
                    disablePadding
                    secondaryAction={
                        <Typography>{entry.amount.toString()}</Typography>
                    }
                >
                    {/* <ListItemAvatar>
                        <Avatar
                            alt={`Avatar n°${""}}`}
                            // src={`/static/images/avatar/${member.avatarUri}.jpg`}
                        />
                    </ListItemAvatar> */}
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
