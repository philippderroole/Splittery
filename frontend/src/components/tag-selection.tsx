import { Tag } from "@/utils/tag";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Chip } from "@mui/material";

interface TagSelectionProps {
    allTags: Tag[];
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
}

export default function TagSelection({
    allTags,
    selectedTags,
    setSelectedTags,
}: TagSelectionProps) {
    const addTag = (tag: Tag) => {
        setSelectedTags([...selectedTags, tag.id]);
    };

    const removeTag = (tag: Tag) => {
        setSelectedTags(selectedTags.filter((id) => id !== tag.id));
    };

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {allTags.map((tag) => {
                const selected = selectedTags.some((id) => id === tag.id);

                return (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        variant={selected ? "filled" : "outlined"}
                        deleteIcon={selected ? <CheckIcon /> : <div />}
                        disabled={
                            tag.type === "AllTag" || tag.type === "UserTag"
                        }
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
                    />
                );
            })}
        </Box>
    );
}
