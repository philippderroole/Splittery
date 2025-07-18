"use client";

import { createMember } from "@/actions/create-split-user-service";
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
import React from "react";
import CreateUser from "./member-form";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateMemberDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

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
                <CreateUser.Root onSubmit={handleSubmit} onCancel={onClose}>
                    <DialogTitle>
                        <CreateUser.Title />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <CreateUser.Description />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <CreateUser.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <CreateUser.CancelButton />
                        <CreateUser.SubmitButton />
                    </DialogActions>
                </CreateUser.Root>
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
