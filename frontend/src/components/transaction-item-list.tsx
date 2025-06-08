"use client";

import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { Split } from "@/utils/split";
import { SerializedTransaction, Transaction } from "@/utils/transaction";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import CreateTransactionItemButton from "./create-transaction-item-button";

interface TransactionListProps {
    split: Split;
    transaction: SerializedTransaction;
}

export default function TransactionList(props: TransactionListProps) {
    const { split, transaction } = props;

    const [transactions, setTransactions] = React.useState<Transaction[]>([]);

    const remainingAmount = transactions.reduce(
        (acc, transaction) =>
            new Money(
                acc.getAmount() - transaction.amount.getAmount(),
                Currencies.EUR
            ),
        new Money(transaction.amount, Currencies.EUR)
    );

    return (
        <>
            <List>
                <ListItem>
                    <ListItemText>Remaining</ListItemText>
                    <ListItemText
                        sx={{
                            textAlign: "right",
                        }}
                    >
                        {remainingAmount.toString()}
                    </ListItemText>
                </ListItem>
                {transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        name={transaction.name}
                        amount={transaction.amount}
                    ></TransactionItem>
                ))}

                <ListItem disablePadding>
                    <CreateTransactionItemButton
                        split={split}
                        remainingAmount={remainingAmount}
                    ></CreateTransactionItemButton>
                </ListItem>
            </List>
        </>
    );
}

interface TransactionItemProps {
    name: string;
    amount: Money;
}

function TransactionItem(props: TransactionItemProps) {
    const { name, amount } = props;

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText>{name}</ListItemText>
                    <ListItemText
                        sx={{
                            textAlign: "right",
                        }}
                    >
                        {amount.toString()}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        </>
    );
}
