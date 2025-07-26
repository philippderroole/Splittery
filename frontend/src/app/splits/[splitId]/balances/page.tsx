"use client";

import { useMembers } from "@/providers/member-provider";
import { useTags } from "@/providers/tag-provider";
import { Currencies } from "@/utils/currencies";
import { Money } from "@/utils/money";
import { Member } from "@/utils/user";
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
import { useState } from "react";
import { CreateMemberDialogButton } from "./components/create-member-dialog";
import { EditMemberDialog } from "./components/edit-member-dialog";

export default function SplitPage() {
    const members = useMembers();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography variant="h4">Balances</Typography>
            <List sx={{ width: "100%", padding: 0 }}>
                {members.map((member) => {
                    return <SplitUserItem member={member} key={member.id} />;
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
    member: Member;
}

function SplitUserItem({ member }: SplitUserItemProps) {
    const tags = useTags();

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <EditMemberDialog
                open={open}
                onClose={handleClose}
                member={member}
            />
            <ListItemButton onClick={handleOpen}>
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
                                {member.tagIds.map((tagId) => {
                                    const tag = tags.find(
                                        (t) => t.id === tagId
                                    );
                                    if (!tag) {
                                        return null;
                                    }
                                    return (
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
                                    );
                                })}
                            </Box>
                        }
                    />
                </ListItem>
            </ListItemButton>
        </>
    );
}

function SaldoItem(props: { user: Member }) {
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
