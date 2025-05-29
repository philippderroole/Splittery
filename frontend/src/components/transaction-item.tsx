"use client";

import { ListItem, ListItemButton, ListItemText } from "@mui/material";

interface TransactionItemProps {
    name: string;
    amount: string;
}

export default function TransactionItem(props: TransactionItemProps) {
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
                        {amount}
                    </ListItemText>
                </ListItemButton>
            </ListItem>
        </>
    );
}
