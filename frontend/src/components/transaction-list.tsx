"use client";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import TransactionItem from "./transaction-item";

type Transaction = { id: string; name: string; amount: string };

export default function TransactionList() {
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);

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
                        -14.20€
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
                    <ListItemButton
                        onClick={() => {
                            setTransactions([
                                ...transactions,
                                {
                                    id: Math.random().toString(36).substring(7),
                                    name: "New Transaction",
                                    amount: "-0.00€",
                                },
                            ]);
                        }}
                    >
                        <ListItemText
                            sx={{
                                textAlign: "center",
                            }}
                        >
                            Add
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );
}
