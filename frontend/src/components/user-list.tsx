"use client";

import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";

export type UserListProps = {
    users: string[];
};

export default function UserList(props: UserListProps) {
    const { users } = props;

    return (
        <List sx={{ width: "100%", padding: 0 }}>
            {users.map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                    <ListItem key={value} disablePadding>
                        <ListItemAvatar>
                            <Avatar
                                alt={`Avatar n°${value + 1}`}
                                src={`/static/images/avatar/${value + 1}.jpg`}
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
                    </ListItem>
                );
            })}
        </List>
    );
}
