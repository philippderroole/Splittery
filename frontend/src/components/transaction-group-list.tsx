import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import TransactionGroup from "./transaction-group";

interface TransactionGroupListProps {
    splitId: string;
}

export default async function TransactionGroupList(
    props: TransactionGroupListProps
) {
    const { splitId } = props;

    /* const transactions = (
        await fetch(process.env.API_URL + "/transactions")
    ).json(); */

    return (
        <>
            <Typography variant="h4">Transactions</Typography>
            <Typography variant="h6">Today</Typography>
            <TransactionGroup
                splitId={splitId}
                name="Netto Marken-Discount"
                time={dayjs().hour(18).minute(43).format("HH:mm")}
                amount={new Money(1820, Currencies.EUR).toString()}
            />
        </>
    );
}
