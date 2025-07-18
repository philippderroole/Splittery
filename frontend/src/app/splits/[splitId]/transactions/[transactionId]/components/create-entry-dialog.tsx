"use client";

import { createEntry } from "@/actions/create-entry-service";
import { useSplit } from "@/providers/split-provider";
import { useTransaction } from "@/providers/transaction-provider";
import { CreateEntryDto } from "@/utils/entry";
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
import EntryForm from "./entry-form";

interface CreateEntryDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateEntryDialog(props: CreateEntryDialogProps) {
    const { open, onClose } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const split = useSplit();
    const transaction = useTransaction();

    const handleSubmit = async (entry: CreateEntryDto) => {
        console.debug("Submitting entry:", entry);

        try {
            await createEntry(split.id, transaction.id, entry);
        } catch (e) {
            console.error("Error creating entry:", e);
            return new Error("Failed to create entry. Please try again.");
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
                <EntryForm.Root onSubmit={handleSubmit} onCancel={onClose}>
                    <DialogTitle>
                        <EntryForm.Title content={"Create a new entry"} />
                    </DialogTitle>
                    <DialogContent sx={{ paddingBottom: 0 }}>
                        <DialogContentText>
                            <EntryForm.Description
                                content={
                                    "Create a new entry for this transaction. Entries are used to split up transactions into smaller parts."
                                }
                            />
                        </DialogContentText>
                        <div style={{ marginTop: "16px" }} />
                        <EntryForm.FormInputs />
                    </DialogContent>
                    <DialogActions>
                        <EntryForm.CancelButton />
                        <EntryForm.SubmitButton content={"Create"} />
                    </DialogActions>
                </EntryForm.Root>
            </Box>
        </Dialog>
    );
}
