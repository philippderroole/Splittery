"use client";

import { useTags } from "@/providers/tag-provider";
import { Tag } from "@/utils/tag";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Chip } from "@mui/material";

interface ChipSelectorProps {
    selectedTagIds: string[];
    setSelectedTagIds: (tagIds: string[]) => void;
    pending?: boolean;
}

export default function ChipSelector({
    selectedTagIds,
    setSelectedTagIds,
    pending = false,
}: ChipSelectorProps) {
    const tags = useTags();

    const addTag = (tag: Tag) => {
        if (selectedTagIds.includes(tag.id)) {
            return;
        }
        setSelectedTagIds([...selectedTagIds, tag.id]);
    };

    const removeTag = (tag: Tag) => {
        setSelectedTagIds(selectedTagIds.filter((id) => id !== tag.id));
    };

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {tags.map((tag) => {
                const selected = selectedTagIds.some((id) => id === tag.id);

                return (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        variant={selected ? "filled" : "outlined"}
                        deleteIcon={selected ? <CheckIcon /> : <div />}
                        sx={{
                            mt: 0.5,
                            backgroundColor: selected
                                ? tag.color
                                : "transparent",
                            borderColor: tag.color,
                            color: selected ? "white" : tag.color,
                            "&:hover": {
                                backgroundColor: selected
                                    ? tag.color
                                    : `${tag.color}20`, // 20% opacity
                            },
                            "&:active": {
                                backgroundColor: selected
                                    ? tag.color
                                    : `${tag.color}40`, // 40% opacity
                            },
                            "&.MuiChip-filled": {
                                "&:hover": {
                                    backgroundColor: tag.color,
                                    filter: "brightness(0.9)",
                                },
                                "&:active": {
                                    backgroundColor: tag.color,
                                    filter: "brightness(0.8)",
                                },
                            },
                        }}
                        onClick={() => {
                            selected ? removeTag(tag) : addTag(tag); // eslint-disable-line @typescript-eslint/no-unused-expressions
                        }}
                        onDelete={() => {
                            selected ? removeTag(tag) : addTag(tag); // eslint-disable-line @typescript-eslint/no-unused-expressions
                        }}
                        disabled={pending}
                    />
                );
            })}
        </Box>
    );
}
