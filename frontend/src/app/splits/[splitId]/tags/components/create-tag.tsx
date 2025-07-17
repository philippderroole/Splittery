"use client";

import { CreateTagDto } from "@/utils/tag";
import {
    Alert,
    Box,
    Button,
    FormControl,
    TextField,
    Typography,
} from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type CreateTagContextType = {
    tag: CreateTagDto;
    onSaveClick: () => void;
    onCancelClick: () => void;
    setName: (name: string) => void;
    color: string;
    setColor: (color: string) => void;
    isPending: boolean;
    error: string | null;
    validationError: string | null;
};

const CreateTagContext = createContext<CreateTagContextType | null>(null);

const useCreateTagContext = () => {
    const currentTagContext = useContext(CreateTagContext);

    if (!currentTagContext) {
        throw new Error(
            "useCreateTagContext must be used within a CreateTagContext.Provider"
        );
    }

    return currentTagContext;
};

interface CreateTagCompoundProps {
    children?: ReactNode;
    onSubmit: (tag: CreateTagDto) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: CreateTagCompoundProps) {
    const { children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);
    const [tag, setTag] = useState<CreateTagDto>({ name: "", color: "" });
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const onSaveClick = async () => {
        if (isPending) return;

        const newTag = { ...tag, name: tag.name.trim() };

        const validationError = validateTagName(newTag.name);
        setValidationError(validationError);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationError) {
            return;
        }

        console.log("Submitting tag:", newTag);

        setPending(true);
        setError(null);
        const result = await onSubmit(newTag);
        setPending(false);

        if (result instanceof Error) {
            setError(result.message);
        }
    };

    const onCancelClick = () => {
        setTag({ ...tag, name: "" });
        setError(null);
        onCancel();
    };

    const setName = (name: string) => {
        setTag((prev) => ({ ...prev, name }));
        setError(null);
    };

    const setColor = (color: string) => {
        setTag((prev) => ({ ...prev, color }));
        setError(null);
    };

    const validateTagName = (name: string) => {
        if (!name) {
            return "Tagname name cannot be empty.";
        }
        if (name.length < 3) {
            return "Tagname name must be at least 3 characters long.";
        }
        if (name.length > 50) {
            return "Tagname name must not exceed 50 characters.";
        }

        return null;
    };

    return (
        <CreateTagContext.Provider
            value={{
                tag,
                setName,
                color: tag.color,
                setColor,
                onSaveClick,
                onCancelClick,
                isPending,
                error,
                validationError,
            }}
        >
            {children}
        </CreateTagContext.Provider>
    );
}

function FormInputs() {
    const { tag, setName, error, isPending, validationError } =
        useCreateTagContext();

    const existsValidationError = validationError !== null;

    return (
        <>
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
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </>
    );
}

function SubmitButton() {
    const { onSaveClick, isPending } = useCreateTagContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSaveClick}
            loading={isPending}
        >
            Create
        </Button>
    );
}

function CancelButton() {
    const { onCancelClick, isPending } = useCreateTagContext();

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

function Title() {
    return "Create a new tag";
}

function Description() {
    return "Create a new tag with a custom name and color.";
}

const CreateTag = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default CreateTag;

function PresetColorPalette() {
    const { color: selectedColor, setColor } = useCreateTagContext();

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
                        border:
                            selectedColor === color ? "3px solid" : "1px solid",
                        borderColor:
                            selectedColor === color
                                ? "primary.main"
                                : "divider",
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
    const { color, setColor } = useCreateTagContext();

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
            }}
        >
            <TextField
                type="color"
                value={color}
                onChange={(e) => {
                    setColor(e.target.value);
                }}
                sx={{ width: 60 }}
            />
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
    const { color: selectedColor } = useCreateTagContext();

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
