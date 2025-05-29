import { Typography } from "@mui/material";
import Link from "next/link";

export default async function SplitPage({
    params,
}: {
    params: Promise<{ splitId: string }>;
}) {
    const { splitId } = await params;

    return (
        <>
            <Typography variant="h2">Split {splitId}</Typography>
            <Link href={`/splits/${splitId}/transactions`}>
                Go to transactions
            </Link>
        </>
    );
}
