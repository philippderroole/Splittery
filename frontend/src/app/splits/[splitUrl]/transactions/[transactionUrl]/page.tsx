import "server-only";

import TransactionList from "@/components/transaction-list";
import { getSplit } from "@/service/split-service";
import { getTransactionGroup } from "@/service/transaction-service";
import { Currencies } from "@/utils/currencies";
import { getFormattedDateLong } from "@/utils/date-formatter";
import { Money } from "@/utils/money";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Link from "next/link";

export default async function TransactionGroupPage({
    params,
}: {
    params: Promise<{
        splitUrl: string | undefined;
        transactionUrl: string | undefined;
    }>;
}) {
    const { splitUrl, transactionUrl } = await params;

    if (!splitUrl || !transactionUrl) {
        throw new Error("Split URL or Transaction URL is missing");
    }

    const split = await getSplit(splitUrl);
    const transactionGroup = await getTransactionGroup(
        split.id,
        transactionUrl
    );

    const amount = new Money(transactionGroup.amount, Currencies.EUR);
    const date = getFormattedDateLong(transactionGroup.date);

    return (
        <>
            <Link href={`/splits/${split.url}/transactions`}>
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
                    <Typography variant="h4">{amount.toString()}</Typography>
                    <Typography variant="body1">
                        {transactionGroup.name}
                    </Typography>
                    <Typography variant="caption">{date}</Typography>
                </Box>
                <Avatar />
            </Box>
            <TransactionList></TransactionList>
        </>
    );
}
