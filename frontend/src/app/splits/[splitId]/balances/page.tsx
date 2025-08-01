"use client";

import { TagChips } from "@/components/tag-chips";
import { useMembers } from "@/providers/member-provider";
import { Member } from "@/utils/user";
import {
    Avatar,
    Box,
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
                    secondaryAction={
                        <>
                            <ExpenseItem member={member} />
                            <ShareItem member={member} />
                        </>
                    }
                >
                    <ListItemAvatar>
                        <Avatar
                            alt={`Avatar n°${""}}`}
                            src={`/static/images/avatar/${member.avatarUri}.jpg`}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={member.name}
                        secondary={<TagChips selectedTagIds={member.tagIds} />}
                    />
                </ListItem>
            </ListItemButton>
        </>
    );
}

function ExpenseItem({ member }: { member: Member }) {
    return (
        <Box
            sx={{
                textAlign: "right",
            }}
        >
            <Typography variant="body1">
                {member.amountSpent.toString()}
            </Typography>
        </Box>
    );
}

function ShareItem({ member }: { member: Member }) {
    return (
        <Box
            sx={{
                textAlign: "right",
            }}
        >
            <Typography variant="body1">
                {member.amountShare.toString()}
            </Typography>
        </Box>
    );
}
