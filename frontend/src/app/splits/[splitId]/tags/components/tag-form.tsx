"use client";

import { useTags } from "@/providers/tag-provider";
import { CreateTagDto, Tag } from "@/utils/tag";
import {
    Box,
    Button,
    FormControl,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type TagFormContextType = {
    tag: CreateTagDto;
    onSaveClick: () => void;
    onCancelClick: () => void;
    setName: (name: string) => void;
    color: string;
    setColor: (color: string) => void;
    isPending: boolean;
    validationError: string | null;
};

const TagFormContext = createContext<TagFormContextType | null>(null);

const useTagFormContext = () => {
    const currentTagContext = useContext(TagFormContext);

    if (!currentTagContext) {
        throw new Error(
            "useCreateTagContext must be used within a CreateTagContext.Provider"
        );
    }

    return currentTagContext;
};

interface TagValidationOptions {
    excludeTagId?: string; // For edit mode - exclude current tag from duplicate check
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
}

const validateTagName = (
    name: string,
    existingTags: Tag[],
    options: TagValidationOptions = {}
) => {
    const {
        excludeTagId,
        minLength = 3,
        maxLength = 50,
        allowEmpty = false,
    } = options;

    if (!name && !allowEmpty) {
        return "Tag name cannot be empty.";
    }

    if (name && name.length < minLength) {
        return `Tag name must be at least ${minLength} characters long.`;
    }

    if (name && name.length > maxLength) {
        return `Tag name must not exceed ${maxLength} characters.`;
    }

    const duplicateTag = existingTags.find(
        (tag) =>
            tag.name.toLowerCase() === name.toLowerCase() &&
            tag.id !== excludeTagId
    );

    if (duplicateTag) {
        return "Tag name already exists. Please choose a different name.";
    }

    return null;
};

interface TagFormCompoundProps {
    tag: CreateTagDto;
    setTag: (tag: CreateTagDto) => void;
    children?: ReactNode;
    onSubmit: (tag: CreateTagDto) => Promise<Error | void>;
    onCancel: () => void;
    validationOptions?: TagValidationOptions;
}

function Root({
    tag,
    setTag,
    children,
    onSubmit,
    onCancel,
    validationOptions = {},
}: TagFormCompoundProps) {
    const tags = useTags();

    const [isPending, setPending] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (isPending) return;
        setPending(true);

        const newTag = { ...tag, name: tag.name.trim() };

        const validationError = validateTagName(newTag.name, tags, {
            ...validationOptions,
        });
        setValidationError(validationError);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationError) {
            setPending(false);
            return;
        }

        await onSubmit(newTag);

        setPending(false);
    };

    const handleAbort = () => {
        onCancel();
    };

    const setName = (name: string) => {
        setTag({ ...tag, name });
    };

    const setColor = (color: string) => {
        setTag({ ...tag, color });
    };

    return (
        <TagFormContext.Provider
            value={{
                tag,
                setName,
                color: tag.color,
                setColor,
                onSaveClick: handleSubmit,
                onCancelClick: handleAbort,
                isPending,
                validationError,
            }}
        >
            {children}
        </TagFormContext.Provider>
    );
}

function FormInputs() {
    const { tag, setName, isPending, validationError } = useTagFormContext();

    const existsValidationError = validationError !== null;

    return (
        <>
            {tag.type == "CustomTag" && (
                <FormControl sx={{ paddingTop: "5px" }} fullWidth>
                    <TextField
                        autoFocus
                        required
                        id="tag-name"
                        name="tag-name"
                        label="Tagname"
                        type="text"
                        value={tag.name}
                        onChange={(e) => setName(e.target.value)}
                        aria-label="Tagname"
                        fullWidth
                        disabled={isPending}
                        error={existsValidationError}
                        helperText={existsValidationError && validationError}
                    />
                </FormControl>
            )}
            <Typography variant="subtitle1" gutterBottom>
                Selected Color
            </Typography>
            <SelectedColor />
            <Typography variant="subtitle2" gutterBottom>
                Preset Colors
            </Typography>
            <PresetColorPalette />
            <Typography variant="subtitle2" gutterBottom>
                Custom Color
            </Typography>
            <ColorSelector />
        </>
    );
}

interface SubmitButtonProps {
    content: ReactNode | string;
}

function SubmitButton(props: SubmitButtonProps) {
    const { onSaveClick, isPending } = useTagFormContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSaveClick}
            loading={isPending}
        >
            {props.content}
        </Button>
    );
}

function CancelButton() {
    const { onCancelClick, isPending } = useTagFormContext();

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onCancelClick}
            disabled={isPending}
        >
            Cancel
        </Button>
    );
}

interface TitleProps {
    content: ReactNode | string;
}

function Title(props: TitleProps) {
    return <>{props.content}</>;
}

interface DescriptionProps {
    content: ReactNode | string;
}

function Description(props: DescriptionProps) {
    return <>{props.content}</>;
}

function PresetColorPalette() {
    const { color: selectedColor, setColor } = useTagFormContext();

    const DEFAULT_COLORS = [
        "#f44336",
        "#e91e63",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#8bc34a",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#ff5722",
        "#795548",
        "#607d8b",
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 1,
                mb: 2,
            }}
        >
            {DEFAULT_COLORS.map((color) => (
                <Box
                    key={color}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: color,
                        color: "primary.main",
                        border: "2px solid",
                        borderColor:
                            selectedColor === color
                                ? "primary.main"
                                : "divider",
                        boxShadow:
                            selectedColor === color ? "0 0 0 2px" : "none",
                        cursor: "pointer",
                        "&:hover": {
                            transform: "scale(1.1)",
                        },
                        transition: "all 0.2s",
                    }}
                    onClick={() => setColor(color)}
                />
            ))}
        </Box>
    );
}

function ColorSelector() {
    const { color, setColor } = useTagFormContext();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
            }}
        >
            {!isMobile && (
                <TextField
                    type="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                    }}
                    sx={{ width: 60 }}
                />
            )}
            <TextField
                label="Hex Color"
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                }}
                size="small"
                fullWidth
            />
        </Box>
    );
}

function SelectedColor() {
    const { color: selectedColor } = useTagFormContext();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
            }}
        >
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: selectedColor,
                    border: "2px solid",
                    borderColor: "divider",
                }}
            />
            <Typography variant="body2">{selectedColor}</Typography>
        </Box>
    );
}

const TagForm = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default TagForm;
