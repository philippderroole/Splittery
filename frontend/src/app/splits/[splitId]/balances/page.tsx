"use client";

import { useSplitUsers } from "@/providers/split-user-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { MemberWithTags, SplitUser } from "@/utils/user";
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
import { CreateMemberDialogButton } from "./components/create-split-user-dialog";

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
                    return <SplitUserItem member={user} key={user.id} />;
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
                <CreateMemberDialogButton />
            </div>
        </div>
    );
}

interface SplitUserItemProps {
    member: MemberWithTags;
}

function SplitUserItem(props: SplitUserItemProps) {
    const { member } = props;

    return (
        <ListItemButton>
            <ListItem
                disablePadding
                secondaryAction={<SaldoItem user={member} />}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={`Avatar n°${""}}`}
                        src={`/static/images/avatar/${member.avatarUri}.jpg`}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={member.name}
                    secondary={
                        <Box sx={{ display: "flex", gap: "2px" }}>
                            {member.tags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    label={tag.name}
                                    size="small"
                                    variant="filled"
                                    sx={{
                                        backgroundColor: tag.color,
                                        mt: 0.5,
                                    }}
                                />
                            ))}
                        </Box>
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
