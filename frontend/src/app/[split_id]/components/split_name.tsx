"use client";

import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
    ButtonGroup,
    Editable,
    EditableInput,
    EditablePreview,
    Flex,
    HStack,
    IconButton,
    useEditableControls,
} from "@chakra-ui/react";

export default function SplitName({ name }) {
    function handleRenameSplit() {
        console.log("rename split");
    }

    function EditableControls() {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent="center" size="sm">
                <IconButton
                    aria-label="submit"
                    icon={<CheckIcon />}
                    {...getSubmitButtonProps()}
                />
                <IconButton
                    aria-label="cancel"
                    icon={<CloseIcon />}
                    {...getCancelButtonProps()}
                />
            </ButtonGroup>
        ) : (
            <Flex direction="row">
                <IconButton
                    aria-label="edit split name"
                    size="sm"
                    icon={<EditIcon />}
                    variant="ghost"
                    {...getEditButtonProps()}
                />
            </Flex>
        );
    }

    return (
        <>
            <Editable
                textAlign="left"
                defaultValue={name}
                fontSize="3xl"
                fontWeight="bold"
                isPreviewFocusable={false}
                onSubmit={handleRenameSplit}>
                <HStack>
                    <EditablePreview />
                    <EditableInput width={"fit-content"} />
                    <EditableControls />
                </HStack>
            </Editable>
        </>
    );
}
