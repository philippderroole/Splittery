"use client";

import { editMember } from "@/actions/member-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateMemberDto, Member } from "@/utils/user";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import MemberForm from "../../../../../components/member-form";

interface EditMemberProps {
    member: Member;
    open: boolean;
    onClose: () => void;
}

export function EditMemberDialog({
    member: initalMember,
    open,
    onClose,
}: EditMemberProps) {
    const split = useSplit();

    const initalTagIds = initalMember.tagIds;

    const [member, setMember] = useState<CreateMemberDto>({
        name: initalMember.name,
        tagIds: initalTagIds,
    });
    const [error, setError] = useState<string | null>(null);
    const [isPending, setPending] = useState(false);

    const handleSubmit = async (member: CreateMemberDto) => {
        setPending(true);

        try {
            await editMember(split.id, initalMember.id, member);
            reset();
            onClose();
        } catch {
            setError("Failed to edit member. Please try again.");
            setPending(false);
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setMember({
            name: initalMember.name,
            tagIds: initalTagIds,
        });
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
                validationOptions={{
                    excludeId: initalMember.id,
                    excludeTagname: initalMember.name,
                }}
                isPending={isPending}
            >
                <DialogTitle>
                    <MemberForm.Title>
                        <>Edit {initalMember.name}</>
                    </MemberForm.Title>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <MemberForm.Description>
                            <>
                                Edit the details of the member. You can change
                                the name and tags.
                            </>
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
                        <>Edit</>
                    </MemberForm.SubmitButton>
                </DialogActions>
            </MemberForm.Root>
        </MobileDialog>
    );
}
