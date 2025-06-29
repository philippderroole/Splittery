"use client";

import { useTransaction } from "@/providers/transaction-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import CreateTransactionItemButton from "./create-transaction-item-button";

export default function TransactionItemList() {
    const transaction = useTransaction();

    const remainingAmount: Money = transaction.items.reduce(
        (acc, transaction) =>
            new Money(
                acc.getAmount() - transaction.amount.getAmount(),
                Currencies.EUR
            ),
        transaction.amount
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
                {transaction.items.map((transactionItem) => (
                    <TransactionItem
                        key={transactionItem.id}
                        name={transactionItem.name}
                        amount={transactionItem.amount}
                    ></TransactionItem>
                ))}

                <ListItem disablePadding>
                    <CreateTransactionItemButton
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
