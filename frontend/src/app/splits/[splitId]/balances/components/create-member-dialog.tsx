"use client";

import { createMember } from "@/actions/create-member-service";
import { useSplit } from "@/providers/split-provider";
import { CreateMemberDto } from "@/utils/user";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
} from "@mui/material";
import React, { useState } from "react";
import MemberForm from "./member-form";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateMemberDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

    const [member, setMember] = useState<CreateMemberDto>({ name: "" });

    const handleSubmit = async (user: CreateMemberDto) => {
        try {
            await createMember(user, split.id);
        } catch {
            return new Error("Failed to create user. Please try again.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <Box sx={{ minWidth: "360px" }}>
                <MemberForm.Root
                    member={member}
                    setMember={setMember}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                >
                    <DialogTitle>
                        <MemberForm.Title />
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <MemberForm.Description />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <MemberForm.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <MemberForm.CancelButton />
                        <MemberForm.SubmitButton />
                    </DialogActions>
                </MemberForm.Root>
            </Box>
        </Dialog>
    );
}

export function CreateMemberDialogButton() {
    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab color="primary" onClick={openDialog}>
                <GroupAddIcon />
            </Fab>
            <CreateMemberDialog open={open} onClose={closeDialog} />
        </>
    );
}
