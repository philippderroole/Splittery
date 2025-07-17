"use client";

import { Money } from "@/utils/money";
import { Avatar, Box, Typography } from "@mui/material";
import Link from "next/link";

interface TransactionProps {
    name: string;
    time: string;
    amount: Money;
    splitId: string;
    url: string;
}

export default function Transaction(props: TransactionProps) {
    const { name, time, amount, splitId, url } = props;

    return (
        <Link
            href={`/splits/${splitId}/transactions/${url}`}
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
                    <Typography variant="body1">{name}</Typography>
                    <Typography variant="caption">{time}</Typography>
                </Box>
                <Box>
                    <Typography variant="body1">{amount.toString()}</Typography>
                </Box>
            </Box>
        </Link>
    );
}
