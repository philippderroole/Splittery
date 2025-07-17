"use client";

import { CreateTagDto, Tag } from "@/utils/tag";
import { Button } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";

type DeleteTagContextType = {
    tag: CreateTagDto;
    onDeleteClick: () => void;
    onCancelClick: () => void;
    isPending: boolean;
    error: string | null;
};

const DeleteTagContext = createContext<DeleteTagContextType | null>(null);

const useDeleteTagContext = () => {
    const currentTagContext = useContext(DeleteTagContext);

    if (!currentTagContext) {
        throw new Error(
            "useDeleteTagContext must be used within a DeleteTagContext.Provider"
        );
    }

    return currentTagContext;
};

interface DeleteTagCompoundProps {
    tag: Tag;
    children?: ReactNode;
    onSubmit: (tag: Tag) => Promise<Error | void>;
    onCancel: () => void;
}

function Root(props: DeleteTagCompoundProps) {
    const { tag, children, onSubmit, onCancel } = props;

    const [isPending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDeleteClick = async () => {
        if (isPending) return;

        setPending(true);
        setError(null);
        const result = await onSubmit(tag);
        setPending(false);

        if (result instanceof Error) {
            setError(result.message);
        }
    };

    const onCancelClick = () => {
        setError(null);
        onCancel();
    };

    return (
        <DeleteTagContext.Provider
            value={{
                tag,
                onDeleteClick,
                onCancelClick,
                isPending,
                error,
            }}
        >
            {children}
        </DeleteTagContext.Provider>
    );
}

function SubmitButton() {
    const { onDeleteClick, isPending } = useDeleteTagContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onDeleteClick}
            loading={isPending}
        >
            Delete
        </Button>
    );
}

function CancelButton() {
    const { onCancelClick, isPending } = useDeleteTagContext();

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
    return "Delete tag";
}

function Description() {
    const { tag } = useDeleteTagContext();

    return `Are you sure you want to delete the tag ${tag.name}? This action cannot be undone.`;
}

const DeleteTag = {
    Root,
    Title,
    Description,
    CancelButton,
    SubmitButton,
};

export default DeleteTag;
