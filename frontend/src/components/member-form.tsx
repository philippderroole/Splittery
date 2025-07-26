"use client";

import TagSelection from "@/components/tag-selection";
import { useMembers } from "@/providers/member-provider";
import { useTags } from "@/providers/tag-provider";
import { Tag } from "@/utils/tag";
import { CreateMemberWithTagsDto, Member } from "@/utils/user";
import { Box, Button, TextField } from "@mui/material";
import { createContext, ReactNode, useContext, useState } from "react";
import { ColorSelector } from "./color-selector";

type MemberFormContextType = {
    member: CreateMemberWithTagsDto;
    setMemberName: (name: string) => void;
    setSelectedTags: (tagIds: string[]) => void;
    color: string;
    setColor: (color: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
    validationError: string | null;
    showTagSelection: boolean;
};

const MemberFormContext = createContext<MemberFormContextType | null>(null);

const useMemberFormContext = () => {
    const currentMemberContext = useContext(MemberFormContext);

    if (!currentMemberContext) {
        throw new Error(
            "useMemberFormContext must be used within a MemberFormContext.Provider"
        );
    }

    return currentMemberContext;
};

interface MemberValidationOptions {
    excludeId?: string;
    excludeTagname?: string;
    minLength?: number;
    maxLength?: number;
    allowEmpty?: boolean;
}

const validateMember = (
    name: string,
    existingMembers: Member[],
    existingTags: Tag[],
    options: MemberValidationOptions = {}
) => {
    const {
        excludeId,
        excludeTagname,
        minLength = 3,
        maxLength = 50,
        allowEmpty = false,
    } = options;

    if (!name && !allowEmpty) {
        return "Username name cannot be empty.";
    }

    if (name && name.length < minLength) {
        return `Username name must be at least ${minLength} characters long.`;
    }

    if (name && name.length > maxLength) {
        return `Username name must not exceed ${maxLength} characters.`;
    }

    const duplicateMember = existingMembers.find(
        (member) =>
            member.name.toLowerCase() === name.toLowerCase() &&
            member.id !== excludeId
    );

    if (duplicateMember) {
        return "Username name already exists. Please choose a different name.";
    }

    const intersectingTagname = existingTags.some(
        (tag) =>
            tag.name.toLowerCase() === name.toLowerCase() &&
            tag.name !== excludeTagname
    );

    if (intersectingTagname) {
        return "A tag with this name already exists. Please choose a different name or rename the existing tag.";
    }

    return null;
};

interface MemberFormCompoundProps {
    member: CreateMemberWithTagsDto;
    setMember: (member: CreateMemberWithTagsDto) => void;
    children?: ReactNode;
    onSubmit: (member: CreateMemberWithTagsDto) => Promise<Error | void>;
    onCancel: () => void;
    isPending: boolean;
    showTagSelection?: boolean;
    validationOptions?: MemberValidationOptions;
}

function Root({
    member,
    setMember,
    children,
    onSubmit,
    onCancel,
    isPending,
    showTagSelection = true,
    validationOptions = {},
}: MemberFormCompoundProps) {
    const members = useMembers();
    const tags = useTags();

    const [validationError, setValidationError] = useState<string | null>(null);
    const [color, setColor] = useState<string>("#327a1cff");

    const handleSubmit = async () => {
        if (isPending) return;

        const newMember = { ...member, name: member.name.trim() };

        const validationError = validateMember(newMember.name, members, tags, {
            ...validationOptions,
        });
        setValidationError(validationError);
        // the validation error is delayed by one render cycle so we use the local variable
        if (validationError) {
            return;
        }

        await onSubmit(newMember);
    };

    const setMemberName = (name: string) => {
        setMember({ ...member, name });
    };

    const setSelectedTags = (tagIds: string[]) => {
        setMember({ ...member, tagIds });
    };

    return (
        <MemberFormContext.Provider
            value={{
                member,
                setMemberName,
                setSelectedTags,
                color,
                setColor,
                onSubmit: handleSubmit,
                onCancel,
                isPending,
                validationError,
                showTagSelection,
            }}
        >
            {children}
        </MemberFormContext.Provider>
    );
}

function FormInputs() {
    const {
        member,
        setMemberName,
        setSelectedTags,
        color,
        setColor,
        isPending,
        validationError,
        showTagSelection,
    } = useMemberFormContext();

    const tags = useTags();

    const dummyTag = {
        id: "dummy-tag",
        name: member.name || "New User",
        type: "UserTag",
        color: color,
    } as Tag;

    const shownTags = [
        dummyTag,
        ...tags
            .filter((tag) => tag.type !== "UserTag")
            .map((tag) => ({
                ...tag,
                isDisabled: tag.type === "AllTag" || tag.type === "UserTag",
            })),
    ];
    const shownSelectedTags = [dummyTag.id, ...member.tagIds];

    const handleSetSelectedTags = (tagIds: string[]) => {
        setSelectedTags(tagIds.filter((id) => id !== dummyTag.id));
    };

    return (
        <>
            <TextField
                autoFocus
                required
                id="user-name"
                name="user-name"
                label="Username"
                type="text"
                value={member.name}
                onChange={(e) => setMemberName(e.target.value)}
                aria-label="Username"
                fullWidth
                disabled={isPending}
                error={validationError !== null}
                helperText={validationError !== null && validationError}
            />
            {showTagSelection && (
                <>
                    <TagSelection
                        allTags={shownTags}
                        selectedTags={shownSelectedTags}
                        setSelectedTags={handleSetSelectedTags}
                    />
                    <Box sx={{ paddingTop: "10px" }} />

                    <ColorSelector color={color} setColor={setColor} />
                </>
            )}
        </>
    );
}

interface SubmitButtonProps {
    children: ReactNode;
}

function SubmitButton({ children }: SubmitButtonProps) {
    const { onSubmit, isPending } = useMemberFormContext();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            loading={isPending}
        >
            <>{children}</>
        </Button>
    );
}

interface CancelButtonProps {
    content: string;
}

function CancelButton({ content }: CancelButtonProps) {
    const { onCancel, isPending } = useMemberFormContext();

    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            disabled={isPending}
        >
            {content}
        </Button>
    );
}

interface TitleProps {
    children: ReactNode;
}

function Title({ children }: TitleProps) {
    return <>{children}</>;
}

interface DescriptionProps {
    children: ReactNode;
}

function Description({ children }: DescriptionProps) {
    return <>{children}</>;
}

const MemberForm = {
    Root,
    Title,
    Description,
    FormInputs,
    CancelButton,
    SubmitButton,
};

export default MemberForm;
