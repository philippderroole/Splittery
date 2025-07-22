"use client";

import { editMember } from "@/actions/member-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateMemberWithTagsDto, MemberWithTags } from "@/utils/user";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import MemberForm from "./member-form";

interface EditMemberProps {
    member: MemberWithTags;
    open: boolean;
    onClose: () => void;
}

export function EditMemberDialog({
    member: initalMember,
    open,
    onClose,
}: EditMemberProps) {
    const split = useSplit();

    const initalTagIds = initalMember.tags.map((tag) => tag.id);

    const [member, setMember] = useState<CreateMemberWithTagsDto>({
        name: initalMember.name,
        tagIds: initalTagIds,
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (member: CreateMemberWithTagsDto) => {
        try {
            await editMember(split.id, initalMember.id, member);
            onClose();
        } catch {
            setError("Failed to edit member. Please try again.");
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
