import { useSplit } from "@/providers/split-provider";
import { getFormattedDay, getFormattedTime } from "@/utils/date-formatter";
import { SerializedTransaction } from "@/utils/transaction";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { default as TransactionGroup } from "./transaction-group";

export default function TransactionGroupList() {
    const split = useSplit();

    const transactions = [] as SerializedTransaction[];

    const transactionsPerDay = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .reduce<Map<string, SerializedTransaction[]>>((acc, group) => {
            const date = dayjs(group.date).format("MM-DD-YYYY");

            acc.set(date, acc.get(date)?.concat(group) || [group]);

            return acc;
        }, new Map<string, SerializedTransaction[]>());

    return (
        <>
            {Array.from(transactionsPerDay.entries()).map(
                ([day, transactions]) => (
                    <div key={day}>
                        <Typography variant="h6">
                            {getFormattedDay(dayjs(day))}
                        </Typography>
                        {transactions.map((transaction) => (
                            <TransactionGroup
                                key={transaction.id}
                                name={transaction.name}
                                time={getFormattedTime(transaction.date)}
                                amount={transaction.amount}
                                splitUrl={split.url}
                                url={transaction.url}
                            />
                        ))}
                    </div>
                )
            )}
        </>
    );
}
