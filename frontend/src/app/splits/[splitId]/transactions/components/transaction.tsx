"use client";

import { useSplit } from "@/providers/split-provider";
import { Transaction } from "@/utils/transaction";
import { Avatar, Box, Typography } from "@mui/material";
import Link from "next/link";

interface TransactionProps {
    transaction: Transaction;
}

export default function TransactionGroup(props: TransactionProps) {
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "start",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Avatar />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                        flexGrow: 1,
                    }}
                >
                    <Typography variant="body1">{transaction.name}</Typography>
                    <Typography variant="caption">{"time"}</Typography>
                </Box>
                <Box>
                    <Typography variant="body1">
                        {transaction.amount.toString()}
                    </Typography>
                </Box>
            </Box>
        </Link>
    );
}
