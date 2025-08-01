"use client";

import { TagChips } from "@/components/tag-chips";
import { useMembers } from "@/providers/member-provider";
import { useSplit } from "@/providers/split-provider";
import { useTransactions } from "@/providers/transactions-provider";
import { getFormattedDay } from "@/utils/date-formatter";
import { Transaction } from "@/utils/transaction";
import {
    Avatar,
    Link,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default function TransactionList() {
    const transactions = useTransactions();

    const transactionsPerDay = transactions
        .sort(
            (a, b) =>
                new Date(b.executedAt).getTime() -
                new Date(a.executedAt).getTime()
        )
        .reduce<Map<string, Transaction[]>>((acc, group) => {
            const date = dayjs(group.executedAt).format("MM-DD-YYYY");

            acc.set(date, acc.get(date)?.concat(group) || [group]);

            return acc;
        }, new Map<string, Transaction[]>());

    return (
        <>
            {Array.from(transactionsPerDay.entries()).map(
                ([day, transactions]) => (
                    <div key={day}>
                        <Typography variant="h6">
                            {getFormattedDay(dayjs(day))}
                        </Typography>
                        {transactions.map((transaction) => (
                            <TransactionListItem
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                )
            )}
        </>
    );
}

interface TransactionProps {
    transaction: Transaction;
}

function TransactionListItem(props: TransactionProps) {
    const { transaction } = props;

    const split = useSplit();
    const members = useMembers();

    const payer = members.find((member) => member.id === transaction.memberId);

    return (
        <Link
            href={`/splits/${split.id}/transactions/${transaction.id}`}
            style={{
                textDecoration: "none",
                color: "inherit",
            }}
        >
            <ListItem
                secondaryAction={
                    <>
                        <Typography textAlign={"right"}>
                            {transaction.amount.toString()}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            payed by {payer?.name}
                        </Typography>
                    </>
                }
            >
                <ListItemIcon>
                    <Avatar />
                </ListItemIcon>
                <ListItemText
                    secondary={<TagChips selectedTagIds={transaction.tagIds} />}
                >
                    <Typography variant="body1">{transaction.name}</Typography>
                </ListItemText>
            </ListItem>
        </Link>
    );
}
