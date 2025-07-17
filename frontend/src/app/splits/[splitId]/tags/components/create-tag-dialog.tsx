"use client";

import { createTag } from "@/actions/tags/create-tag-service";
import { useSplit } from "@/providers/split-provider";
import { CreateTagDto } from "@/utils/tag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React from "react";
import TagForm from "./tag-form";

interface CreateUserDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateSplitUserDialog(props: CreateUserDialogProps) {
    const { open, onClose } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const split = useSplit();

    const handleSubmit = async (tag: CreateTagDto) => {
        try {
            await createTag(split.id, tag);
        } catch {
            return new Error("Failed to create user. Please try again.");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        ...(isMobile && {
                            position: "fixed",
                            top: "10%",
                            margin: "0 16px",
                            width: "calc(100% - 32px)",
                            maxWidth: "none",
                            borderRadius: 2,
                        }),
                    },
                },
            }}
        >
            <Box sx={{ minWidth: "360px" }}>
                <TagForm.Root onSubmit={handleSubmit} onCancel={onClose}>
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
                    </DialogContent>
                    <DialogActions>
                        <TagForm.CancelButton />
                        <TagForm.SubmitButton content={"Create"} />
                    </DialogActions>
                </TagForm.Root>
            </Box>
        </Dialog>
    );
}

export function CreateTagDialogButton() {
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
                <LocalOfferIcon />
            </Fab>
            <CreateSplitUserDialog open={open} onClose={closeDialog} />
        </>
    );
}
