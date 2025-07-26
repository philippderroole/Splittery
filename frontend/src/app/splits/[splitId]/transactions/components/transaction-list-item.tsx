"use client";

import { useSplit } from "@/providers/split-provider";
import { getFormattedTime } from "@/utils/date-formatter";
import { Transaction } from "@/utils/transaction";
import {
    Avatar,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import Link from "next/link";

interface TransactionProps {
    transaction: Transaction;
}

export default function TransactionListItem(props: TransactionProps) {
    const { transaction } = props;

    const split = useSplit();

    return (
        <Link
            href={`/splits/${split.id}/transactions/${transaction.id}`}
            style={{
                textDecoration: "none",
                color: "inherit",
            }}
        >
            <ListItem
                secondaryAction={
                    <Typography>{transaction.amount.toString()}</Typography>
                }
            >
                <ListItemIcon>
                    <Avatar />
                </ListItemIcon>
                <ListItemText
                    secondary={
                        <Typography variant="caption">
                            {getFormattedTime(transaction.executedAt)}
                        </Typography>
                    }
                >
                    <Typography variant="body1">{transaction.name}</Typography>
                </ListItemText>
            </ListItem>
        </Link>
    );
}
