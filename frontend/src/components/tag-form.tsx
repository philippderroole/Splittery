"use client";

import { useTags } from "@/providers/tag-provider";
import { CreateTagDto, Tag } from "@/utils/tag";
import { Button, FormControl, TextField } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";
import { ColorSelector } from "./color-selector";

type TagFormContextType = {
    tag: CreateTagDto;
    onSubmit: () => void;
    onCancel: () => void;
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

    const handleCancel = () => {
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
                onSubmit: handleSubmit,
                onCancel: handleCancel,
                isPending,
                validationError,
            }}
        >
            {children}
        </TagFormContext.Provider>
    );
}

function FormInputs() {
    const { tag, setName, isPending, validationError, color, setColor } =
        useTagFormContext();

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

            <ColorSelector color={color} setColor={setColor} />
        </>
    );
}

interface SubmitButtonProps {
    content: ReactNode | string;
}

function SubmitButton(props: SubmitButtonProps) {
    const { onSubmit: onSaveClick, isPending } = useTagFormContext();

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
    const { onCancel: onCancelClick, isPending } = useTagFormContext();

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

const TagForm = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default TagForm;
