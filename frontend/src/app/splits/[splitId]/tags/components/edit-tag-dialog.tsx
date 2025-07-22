"use client";

import { editTag } from "@/actions/tags/edit-tag-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateTagDto, EditTagDto, Tag } from "@/utils/tag";
import {
    Alert,
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import TagForm from "./tag-form";

interface EditTagDialogProps {
    initialTag: Tag;
    open: boolean;
    onClose: () => void;
}

export function EditTagDialog(props: EditTagDialogProps) {
    const { initialTag, open, onClose } = props;

    const [error, setError] = useState<string | null>(null);
    const [tag, setTag] = useState<CreateTagDto>({ ...initialTag });

    const split = useSplit();

    const handleSubmit = async (tag: EditTagDto) => {
        try {
            await editTag(split.id, initialTag.id, tag);
            onClose();
        } catch {
            setError("Failed to edit tag. Please try again.");
        }
    };

    const handleAbort = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setTag({ ...tag, name: "" });
    };

    return (
        <MobileDialog open={open} onClose={handleAbort}>
            <Box sx={{ minWidth: "360px" }}>
                <TagForm.Root
                    tag={tag}
                    setTag={setTag}
                    onSubmit={handleSubmit}
                    onCancel={handleAbort}
                    validationOptions={{ excludeTagId: initialTag.id }}
                >
                    <DialogTitle>
                        <TagForm.Title content={`Edit ${initialTag.name}`} />
                    </DialogTitle>

                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <TagForm.Description
                                content={
                                    initialTag.type === "CustomTag"
                                        ? "Edit the details of the tag. You can change the name and color."
                                        : "You can change the color."
                                }
                            />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <TagForm.FormInputs />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <TagForm.CancelButton />
                        <TagForm.SubmitButton content={"Edit"} />
                    </DialogActions>
                </TagForm.Root>
            </Box>
        </MobileDialog>
    );
}
