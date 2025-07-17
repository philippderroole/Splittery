"use client";

import { editTag } from "@/actions/tags/edit-tag-service";
import { useSplit } from "@/providers/split-provider";
import { EditTagDto, Tag } from "@/utils/tag";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import TagForm from "./tag-form";

interface EditTagDialogProps {
    initialTag: Tag;
    open: boolean;
    onClose: () => void;
}

export function EditTagDialog(props: EditTagDialogProps) {
    const { initialTag, open, onClose } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const split = useSplit();

    const handleSubmit = async (tag: EditTagDto) => {
        try {
            await editTag(split.id, initialTag.id, tag);
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
                <TagForm.Root
                    initalTag={initialTag}
                    onSubmit={handleSubmit}
                    onCancel={onClose}
                >
                    <DialogTitle>
                        <TagForm.Title content={`Edit ${initialTag.name}`} />
                    </DialogTitle>

                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <TagForm.Description
                                content={
                                    initialTag?.isPredefined
                                        ? "You can change the color."
                                        : "Edit the details of the tag. You can change the name and color."
                                }
                            />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <TagForm.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <TagForm.CancelButton />
                        <TagForm.SubmitButton content={"Edit"} />
                    </DialogActions>
                </TagForm.Root>
            </Box>
        </Dialog>
    );
}
