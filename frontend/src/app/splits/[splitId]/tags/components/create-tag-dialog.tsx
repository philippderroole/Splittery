"use client";

import { createTag } from "@/actions/tags/create-tag-service";
import MobileDialog from "@/components/mobile-dialog";
import { useSplit } from "@/providers/split-provider";
import { CreateTagDto } from "@/utils/tag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
    Alert,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
} from "@mui/material";
import { useState } from "react";
import TagForm from "../../../../../components/tag-form";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateSplitUserDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const split = useSplit();

    const [error, setError] = useState<string | null>(null);
    const [tag, setTag] = useState<CreateTagDto>({
        name: "",
        color: "#f44336",
        type: "CustomTag",
    });

    const handleSubmit = async (tag: CreateTagDto) => {
        try {
            await createTag(split.id, tag);
            onClose();
        } catch {
            setError("Failed to create tag. Please try again.");
        }
    };

    const handleCancel = () => {
        reset();
        onClose();
    };

    const reset = () => {
        setTag({ ...tag, name: "" });
    };

    return (
        <MobileDialog open={open} onClose={handleCancel}>
            <TagForm.Root
                tag={tag}
                setTag={setTag}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
            >
                <DialogTitle>
                    <TagForm.Title content={"Create a new tag"} />
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: 0 }}>
                    <DialogContentText>
                        <TagForm.Description
                            content={
                                "Create a new tag with a custom name and color."
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
                    <TagForm.SubmitButton content={"Create"} />
                </DialogActions>
            </TagForm.Root>
        </MobileDialog>
    );
}

export function CreateTagDialogButton() {
    const [open, setOpen] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab color="primary" onClick={openDialog}>
                <LocalOfferIcon />
            </Fab>
            <CreateSplitUserDialog open={open} onClose={closeDialog} />
        </>
    );
}
