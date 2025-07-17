"use client";

import TransactionItemList from "@/components/transaction-item-list";
import UserSelectionList from "@/components/user-selection-list";
import { useSplit } from "@/providers/split-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { getFormattedDateLong } from "@/utils/date-formatter";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";

export default function TransactionPage() {
    const split = useSplit();
    const transaction = useTransaction();

    const date = getFormattedDateLong(transaction.date);

    return (
        <>
            <Link href={`/splits/${split.id}/transactions`}>
                <IconButton>
                    <ArrowBackIosIcon />
                </IconButton>
            </Link>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "space-between",
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        justifyContent: "start",
                    }}
                >
                    <Typography variant="h4">
                        {transaction.amount.toString()}
                    </Typography>
                    <Typography variant="body1">{transaction.name}</Typography>
                    <Typography variant="caption">{date}</Typography>
                </Box>
                <Avatar />
            </Box>
            <TransactionItemList></TransactionItemList>
            <UserSelectionList></UserSelectionList>
        </>
    );
}
