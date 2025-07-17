"use client";

import { useSplitUsers } from "@/providers/split-user-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { SplitUser } from "@/utils/user";
import {
    Avatar,
    Box,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { CreateUserDialogButton } from "./components/create-split-user-dialog";

export default function SplitPage() {
    const splitUsers = useSplitUsers();

    console.debug("SplitPage: ", splitUsers);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4">Balances</Typography>
            <List sx={{ width: "100%", padding: 0 }}>
                {splitUsers.map((user) => {
                    return <SplitUserItem user={user} key={2} />;
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
                <CreateUserDialogButton />
            </div>
        </div>
    );
}

interface SplitUserItemProps {
    user: SplitUser;
}

function SplitUserItem(props: SplitUserItemProps) {
    const { user } = props;

    return (
        <ListItemButton>
            <ListItem
                disablePadding
                secondaryAction={<SaldoItem user={user} />}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={`Avatar n°${""}}`}
                        src={`/static/images/avatar/${user.avatarUri}.jpg`}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={user.name}
                    secondary={
                        <Chip
                            label="all"
                            size="small"
                            variant="filled"
                            sx={{
                                backgroundColor: "#e00b0bff",
                            }}
                        />
                    }
                />
            </ListItem>
        </ListItemButton>
    );
}

function SaldoItem(props: { user: SplitUser }) {
    const { user } = props;

    return (
        <Box
            sx={{
                textAlign: "right",
                paddingRight: 4,
            }}
        >
            <Typography variant="body1">
                {new Money(user.saldo, Currencies.EUR).toString()}
            </Typography>
        </Box>
    );
}
