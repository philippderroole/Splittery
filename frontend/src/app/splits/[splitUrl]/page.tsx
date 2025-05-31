import { getSplit } from "@/service/split-service";
import { Typography } from "@mui/material";
import Link from "next/link";

export default async function SplitPage({
    params,
}: {
    params: Promise<{ splitUrl: string }>;
}) {
    const { splitUrl } = await params;

    const split = await getSplit(splitUrl);

    return (
        <>
            <Typography variant="h2">Split {split.name}</Typography>
            <Link href={`/splits/${splitUrl}/transactions`}>
                Go to transactions
            </Link>
        </>
    );
}
