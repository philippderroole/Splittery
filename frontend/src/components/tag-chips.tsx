"use client";

import { useTags } from "@/providers/tag-provider";
import { Box, Chip } from "@mui/material";

interface TagChipsProps {
    selectedTagIds: string[];
}

export function TagChips({ selectedTagIds }: TagChipsProps) {
    const tags = useTags();

    return (
        <Box
            sx={{
                display: "flex",
                gap: "2px",
                flexWrap: "wrap",
                maxWidth: "calc(100% - 80px)",
            }}
        >
            {selectedTagIds.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId)!;
                return (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        size="small"
                        variant="filled"
                        sx={{
                            backgroundColor: tag.color,
                            mt: 0.5,
                        }}
                    />
                );
            })}
        </Box>
    );
}
