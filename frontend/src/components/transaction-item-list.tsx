"use client";

import { updateTransactionItem } from "@/actions/update-transaction-item-service";
import { useTransaction } from "@/providers/transaction-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { UpdateTransactionItem } from "@/utils/transaction-item";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import CreateTransactionItemButton from "./create-transaction-item-button";
import { TransactionItemDialog } from "./transaction-item-dialog";

export default function TransactionItemList() {
    const transaction = useTransaction();

    const remainingAmount: Money =
        transaction.items.find((item) => item.name === "Remaining")?.amount ??
        new Money(0, Currencies.EUR);

    return (
        <>
            <List>
                <TransactionItem
                    name="Remaining"
                    amount={remainingAmount}
                    remainingAmount={remainingAmount}
                ></TransactionItem>
                {transaction.items
                    .filter((item) => item.name !== "Remaining")
                    .map((transactionItem) => (
                        <TransactionItem
                            key={transactionItem.id}
                            name={transactionItem.name}
                            amount={transactionItem.amount}
                            remainingAmount={remainingAmount}
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
    remainingAmount: Money;
}

function TransactionItem(props: TransactionItemProps) {
    const { name, amount, remainingAmount } = props;

    const [openDialog, setOpenDialog] = useState(false);

    return (
        <>
            <TransactionItemDialog
                title={`Edit item: ${name}`}
                initialName={name}
                initialAmount={amount}
                remainingAmount={remainingAmount}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onError={(error) => {
                    console.error("Error creating transaction item:", error);
                }}
                submitTransactionItem={submitTransactionItem}
            ></TransactionItemDialog>
            <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenDialog(true)}>
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

const submitTransactionItem = (
    name: string,
    amount: number,
    transactionId: string,
    splitId: string,
    url?: string,
    onClose?: () => void,
    onError?: (error?: string) => void
) => {
    const transactionItem: UpdateTransactionItem = {
        name: name,
        amount: amount,
        url: url!,
    };

    updateTransactionItem(transactionItem, splitId, transactionId)
        .then(() => {
            onClose?.();
        })
        .catch((error) => {
            onError?.(error.message);
        });
};
