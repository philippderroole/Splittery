"use client";

import { createMember } from "@/actions/member-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateMemberWithTagsDto } from "@/utils/user";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
} from "@mui/material";
import React, { useState } from "react";
import MemberForm from "../../../../../components/member-form";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateMemberDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

    const [member, setMember] = useState<CreateMemberWithTagsDto>({
        name: "",
        tagIds: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (member: CreateMemberWithTagsDto) => {
        setPending(true);

        try {
            await createMember(member, split.id);
            reset();
            onClose();
        } catch {
            setError("Failed to create user. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setMember({ name: "", tagIds: [] });
        setError(null);
        setPending(false);
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <MemberForm.Root
                member={member}
                setMember={setMember}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isPending={isPending}
            >
                <DialogTitle>
                    <MemberForm.Title>
                        <>Create a new member</>
                    </MemberForm.Title>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <MemberForm.Description>
                            <>Please enter a username for the new member.</>
                        </MemberForm.Description>
                    </DialogContentText>
                    <div style={{ marginTop: "16px" }} />
                    <MemberForm.FormInputs />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <MemberForm.CancelButton content="Cancel" />
                    <MemberForm.SubmitButton>
                        <>Create</>
                    </MemberForm.SubmitButton>
                </DialogActions>
            </MemberForm.Root>
        </MobileDialog>
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
