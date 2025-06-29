"use client";

import CreateUserButton from "@/components/create-user-button";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import { useSplit } from "../../../../providers/split-provider";

export default function SplitPage() {
    const split = useSplit();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4">Balances</Typography>
            <List sx={{ width: "100%", padding: 0 }}>
                {split.users.map((user) => {
                    const labelId = `list-label-${user.id}`;

                    return (
                        <ListItem key={user.id} disablePadding>
                            <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${user.id}`}
                                    src={`/static/images/avatar/${user.id}.jpg`}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                id={labelId}
                                primary={user.username}
                            />
                            <ListItemText
                                id={labelId}
                                primary={new Money(
                                    user.balance,
                                    Currencies.EUR
                                ).toString()}
                                sx={{
                                    textAlign: "right",
                                    paddingRight: 4,
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateUserButton split={split} />
            </div>
        </div>
    );
}
