import "server-only";

import { Avatar, Box, Typography } from "@mui/material";
import Link from "next/link";

interface TransactionGroupProps {
    name: string;
    time: string;
    amount: string;
    splitUrl: string;
    url: string;
}

export default async function TransactionGroup(props: TransactionGroupProps) {
    const { name, time, amount, splitUrl, url } = props;

    return (
        <>
            <Link href={`/splits/${splitUrl}/transactions/${url}`}>
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
                        <Typography variant="body1">{amount}</Typography>
                    </Box>
                </Box>
            </Link>
        </>
    );
}
