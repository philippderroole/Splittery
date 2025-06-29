"use client";

import { useSplit } from "@/providers/split-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import {
    Avatar,
    Checkbox,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { useState } from "react";

export interface UserSelectionListProps {
    totalAmount?: number;
}

export default function UserSelectionList(props: UserSelectionListProps) {
    const { totalAmount } = props;
    const split = useSplit();

    const [checked, setChecked] = useState<string[]>([]);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const amountPerCheckedUser = totalAmount
        ? new Money(totalAmount / checked.length, Currencies.EUR).toString()
        : undefined;

    return (
        <List sx={{ width: "100%", padding: 0 }}>
            {split.users.map((user) => {
                const labelId = `checkbox-list-label-${user}`;

                return (
                    <ListItem key={user.id} disablePadding>
                        <ListItemButton
                            onClick={handleToggle(user.id)}
                            sx={{
                                paddingX: 0,
                                paddingY: 0.5,
                            }}
                        >
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
                                primary={
                                    checked.includes(user.id)
                                        ? amountPerCheckedUser
                                        : undefined
                                }
                                sx={{
                                    textAlign: "right",
                                    paddingRight: 4,
                                }}
                            />
                            <Checkbox
                                edge="end"
                                checked={checked.includes(user.id)}
                                tabIndex={-1}
                                disableRipple
                                sx={{
                                    paddingX: "21px",
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
