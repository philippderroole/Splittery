"use client";

import { useTransactions } from "@/providers/transactions-provider";
import { getFormattedDay } from "@/utils/date-formatter";
import { Transaction } from "@/utils/transaction";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { default as TransactionGroup } from "./transaction";

export default function TransactionList() {
    const transactions = useTransactions();

    const transactionsPerDay = transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .reduce<Map<string, Transaction[]>>((acc, group) => {
            const date = dayjs(group.date).format("MM-DD-YYYY");

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
                            <TransactionGroup
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
