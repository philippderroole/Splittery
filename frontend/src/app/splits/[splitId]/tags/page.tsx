"use client";

import { useTags } from "@/providers/tag-provider";
import { Tag } from "@/utils/tag";
import {
    Box,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import React from "react";
import { CreateTagDialogButton } from "./components/create-tag-dialog";
import { DeleteTagDialogButton } from "./components/delete-tag-dialog";
import { EditTagDialog } from "./components/edit-tag-dialog";

export default function TagsPage() {
    const tags = useTags();

    return (
        <>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Tags
            </Typography>
            <TagsList tags={tags} />
            <div
                style={{
                    position: "fixed",
                    bottom: "6rem",
                    right: "3rem",
                    zIndex: 1200,
                }}
            >
                <CreateTagDialogButton />
            </div>
        </>
    );
}

interface TagsListProps {
    tags: Tag[];
}

function TagsList(props: TagsListProps) {
    const { tags } = props;

    return (
        <List>
            {tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} />
            ))}
        </List>
    );
}

interface TagItemProps {
    tag: Tag;
}

function TagItem(props: TagItemProps) {
    const { tag } = props;

    const [open, setOpen] = React.useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <ListItem disablePadding secondaryAction={<Actions tag={tag} />}>
                <ListItemButton onClick={openDialog}>
                    <ListItemIcon>
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                bgcolor: tag.color,
                                border: "2px solid",
                                borderColor: "divider",
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={tag.name}
                        secondary={
                            <Chip
                                label={tag.color}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                            />
                        }
                    />
                </ListItemButton>
            </ListItem>
            <EditTagDialog initialTag={tag} open={open} onClose={closeDialog} />
        </>
    );
}

interface ActionsProps {
    tag: Tag;
}

function Actions(props: ActionsProps) {
    const { tag } = props;

    return (
        <Box sx={{ display: "flex" }}>
            {!tag.isPredefined && <DeleteTagDialogButton tag={tag} />}
        </Box>
    );
}
