import TransactionList from "@/components/transaction-list";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";

export default async function TransactionGroupPage({
    params,
}: {
    params: Promise<{ splitId: string; transactionId: string }>;
}) {
    const { splitId, transactionId } = await params;

    const transactionGroup = fetch(
        process.env.API_URL + `/splits/${splitId}/transactions/${transactionId}`
    );

    return (
        <>
            <Link href={`/splits/${splitId}/transactions`}>
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
                    <Typography variant="h4">-18.20€</Typography>
                    <Typography variant="body1">
                        Netto Marken-Discount
                    </Typography>
                    <Typography variant="caption">Yesterday, 18:43</Typography>
                </Box>
                <Avatar />
            </Box>
            <TransactionList></TransactionList>
        </>
    );
}
