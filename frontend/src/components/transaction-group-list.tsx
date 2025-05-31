import { getSplit } from "@/service/split-service";
import { getTransactionGroups } from "@/service/transaction-service";
import { Currencies } from "@/utils/currencies";
import { getFormattedDay, getFormattedTime } from "@/utils/date-formatter";
import { Money } from "@/utils/money";
import { TransactionGroup as TransactionGroupType } from "@/utils/transaction-group";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { default as TransactionGroup } from "./transaction-group";

interface TransactionGroupListProps {
    splitUrl: string;
}

export default async function TransactionGroupList(
    props: TransactionGroupListProps
) {
    const { splitUrl } = props;

    const split = await getSplit(splitUrl);
    const transactionGroups = await getTransactionGroups(split.id);

    const transactionGroupsByDay = transactionGroups
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .reduce<Map<string, TransactionGroupType[]>>((acc, group) => {
            const date = dayjs(group.date).toISOString();

            acc.set(date, acc.get(date)?.concat(group) || [group]);

            return acc;
        }, new Map<string, TransactionGroupType[]>());

    return (
        <>
            <Typography variant="h4">Transactions</Typography>
            {Array.from(transactionGroupsByDay.entries()).map(
                ([day, transactionGroups]) => (
                    <div key={day}>
                        <Typography variant="h6">
                            {getFormattedDay(dayjs(day))}
                        </Typography>
                        {transactionGroups.map((transactionGroup) => (
                            <TransactionGroup
                                key={transactionGroup.id}
                                name={transactionGroup.name}
                                time={getFormattedTime(transactionGroup.date)}
                                amount={new Money(
                                    transactionGroup.amount,
                                    Currencies.EUR
                                ).toString()}
                                splitUrl={split.url}
                                url={transactionGroup.url}
                            />
                        ))}
                    </div>
                )
            )}
        </>
    );
}
