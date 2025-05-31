import TransactionGroupList from "@/components/transaction-group-list";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Link from "next/link";

export default async function TransactionGroupListPage({
    params,
}: {
    params: Promise<{ splitUrl: string }>;
}) {
    const { splitUrl } = await params;

    return (
        <>
            <Link href={`/splits/${splitUrl}`}>
                <IconButton>
                    <ArrowBackIosIcon />
                </IconButton>
            </Link>
            <TransactionGroupList splitUrl={splitUrl} />
        </>
    );
}
