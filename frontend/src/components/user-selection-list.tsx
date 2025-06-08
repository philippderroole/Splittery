"use client";

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

export default function UserSelectionList() {
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

    return (
        <List sx={{ width: "100%", padding: 0 }}>
            {["Philipp", "Corny", "Sophia"].map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                    <ListItem key={value} disablePadding>
                        <ListItemButton
                            onClick={handleToggle(value)}
                            sx={{
                                paddingX: 0,
                                paddingY: 0.5,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    alt={`Avatar n°${value + 1}`}
                                    src={`/static/images/avatar/${
                                        value + 1
                                    }.jpg`}
                                />
                            </ListItemAvatar>
                            <ListItemText id={labelId} primary={value} />
                            <ListItemText
                                id={labelId}
                                primary="-10.00 €"
                                sx={{
                                    textAlign: "right",
                                    paddingRight: 4,
                                }}
                            />
                            <Checkbox
                                edge="end"
                                checked={checked.includes(value)}
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
